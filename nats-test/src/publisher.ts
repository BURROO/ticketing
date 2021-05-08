import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';


console.clear();

// Connect to localhost temporarly
// k port-forward nats-depl-577bd78677-kr75s 4222:4222

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
}) // stan is client

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  try{
    await publisher.publish({
      id: '123', 
      title: 'concert',
      price: 20
    });
  }catch(err){
    console.error(err)
  }
})
