import express from 'express';

// import { currentUser } from '../middlewares/current-user';
import { currentUser } from '@pkticketingtickets/common';

const router = express.Router();

router.get(
  '/api/users/currentuser', 
  currentUser,
  (req, res) => {
    res.send({ currentUser: req.currentUser || null }); // send back null instead of undefined
});

export { router as currentUserRouter };