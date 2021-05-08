import { Subjects, Publisher, PaymentCreatedEvent } from '@pkticketingtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}