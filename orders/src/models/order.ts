import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@pkticketingtickets/common';
import { TicketDoc } from './ticket';

// One source order related
export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus; // get enum
  expiresAt: Date;
  ticket: TicketDoc;
}

// Values could vary from OrderAttrs
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus; // get enum
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus), // Make sure only expected string will be accepted
    default: OrderStatus.Created // optional to make sure this always will be set
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order };