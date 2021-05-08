import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@pkticketingtickets/common';
import { CreateChargeRouter } from './routes/new'

const app = express();
app.set('trust proxy', true) // proxy through nginx
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' // allow http for test env
    // secure: true
  })
);
app.use(currentUser);

app.use(CreateChargeRouter);

app.get('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };