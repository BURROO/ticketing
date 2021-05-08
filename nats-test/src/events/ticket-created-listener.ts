import { Message } from 'node-nats-streaming';
import { Listener, TicketCreatedEvent, Subjects } from '@pkticketingtickets/common'


class TicketCreateListener extends Listener<TicketCreatedEvent> {
  // From Course
  // subject: Subjects.TicketCreated = Subjects.TicketCreated; // providing type annotation so that subject value cant be changed!
  // With typescript read only
  readonly subject= Subjects.TicketCreated; // providing type annotation so that subject value cant be changed!
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message){
    console.log('Event data!', data)

    msg.ack();
  }
}

export { TicketCreateListener }