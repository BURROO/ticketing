import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest'
import { app } from '../app';

declare global{
  namespace NodeJS{
    interface Global{
      signin(): Promise<string[]>
    }
  }
}

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
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections) {
    await collection.deleteMany({});
  }

});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
})

global.signin = async() => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201)

  const cookie = response.get('Set-Cookie');

  return cookie;
};