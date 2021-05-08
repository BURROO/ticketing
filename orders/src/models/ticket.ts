import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
// One source order related
import { Order, OrderStatus } from './order';


// THIS IS THE MODEL ONLY FOR THE ORDER SERVICE
// NOT THE TICKET SERVIE!!!
// ONLY SPECIFIC VALUES ARE NEEDED HERE

interface TicketAttrs {
  id: string,
  title: string,
  price: number,
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// // Customized implementation of updateIfCurrentPlugin
// ticketSchema.pre('save', function(done) {
//   // @ts-ignore > Tell Typescript to ignore next line
//   this.$where = {
//     version: this.get('version') - 1
//   };

//   done()
// })

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // return new Ticket(attrs);
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
}
ticketSchema.methods.isReserved = async function() {
  // this === the ticket document we just called 'isReserved' on
  
  // Run query to look at all orders. Find an order where the ticket
  // is the ticket we just found *and* the orders status is *not* cancelled.
  // if we find an ordr from that means ticket *is* reserved

  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      // Find an order that matches one of these statuses
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket }