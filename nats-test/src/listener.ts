import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreateListener } from './events/ticket-created-listener'

console.clear();
// k port-forward nats-depl-7b5d4f58f9-lwvvg 4222:4222
// FOR MONITORING
// k port-forward nats-depl-7b5d4f58f9-lwvvg 8222:8222
// >>> http://localhost:8222/streaming/channelsz?subs=1

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http:localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to nats');

  stan.on('close', () => {
    console.log('NATS connection closed')
    process.exit();
  })

  new TicketCreateListener(stan).listen();
})

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

