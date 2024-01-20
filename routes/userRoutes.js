import express from 'express';
import {
  deleteUser,
  getSingleUser,
  updateUser,
} from '../controllers/userInfoController.js';

const userRoute = express.Router();

userRoute.get('/:id', getSingleUser);
userRoute.put('/update/:id', updateUser);
userRoute.delete('/delete/:id', deleteUser);

export { userRoute };
