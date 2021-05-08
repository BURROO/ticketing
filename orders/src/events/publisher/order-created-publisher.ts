

import { Publisher, OrderCreatedEvent, Subjects } from '@pkticketingtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}