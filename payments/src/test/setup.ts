import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

declare global{
  namespace NodeJS{
    interface Global{
      signin(id?: string): string[]
    }
  }
}

jest.mock('../nats-wrapper'); // simulate nats-wrapper > not to create actual tickets

// SHOULD BE IN .env!!
process.env.STRIPE_KEY = 'sk_test_51IREWLHWKGejbieVEpW1VopqKHqA17EwEup14Gruc1fyU658uawvCpUOmf7Wk4a07vESJTT639NWEHzdnC0MOUGm00vyQdgDTU'

let mongo: any;

beforeAll(async () => {

  process.env.JWT_KEY='asfasf'; // define env variable for test environment
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

});

beforeEach(async () => {
  jest.clearAllMocks(); // remove previously called functions
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
})

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session object. { jwt MY_JWT}
  const session = { jwt: token };

  // Turn that session into json
  const sessionJSON = JSON.stringify(session)

  // Take JSON and decode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`]
};