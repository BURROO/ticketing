import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@pkticketingtickets/common';
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments', 
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty(),
    body('orderId')
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // res.send({ success: true })
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if(!order) {
      throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if(order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'eur',
      amount: order.price * 100, //amout has to be in cents
      source: token
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    })
    await payment.save();

    // Await optional; make sure the event has been published b ewfore
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })
  
    // Upon to you what kind of data you want to return
    res.status(201).send({ id: payment.id });

});

export { router as CreateChargeRouter }