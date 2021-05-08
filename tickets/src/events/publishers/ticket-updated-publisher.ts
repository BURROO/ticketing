import { Publisher, Subjects, TicketUpdatedEvent } from '@pkticketingtickets/common';
import { natsWrapper } from '../../nats-wrapper';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  // readonly subject = Subjects.TicketUpdated;
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}