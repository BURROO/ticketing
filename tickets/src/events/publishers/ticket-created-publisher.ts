import { Publisher, Subjects, TicketCreatedEvent } from '@pkticketingtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // readonly subject = Subjects.TicketCreated;
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}