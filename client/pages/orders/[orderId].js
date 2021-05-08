import { useEffect, useState } from "react";
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft ] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000))
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if(timeLeft < 0){
    return <div>Order expired</div>
  }

  return(
    <div>
      {timeLeft} Seconds until Order expires
      <StripeCheckout
      token={( id ) => doRequest({ token: id })}
      stripeKey="pk_test_51IREWLHWKGejbieVvOGXT4eofPSwOG5o8OGVpmFDydLGEeZ6TISNaymfQE1EdcW47j5xKSqhHBkmL01bT9yf2HCJ00Ao0aEq1g"
      amount={order.ticket.price}
      email={currentUser.email}     
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow