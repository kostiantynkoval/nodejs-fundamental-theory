import express from 'express';
import { getUsers, createNewUser, getUserById, updateUserById, deleteUserById } from '../controllers/user.controller';
import { isUserAuthorized } from '../middlewares';

const userRouter: express.Router = express.Router();

// Get all not deleted users
userRouter.get('/', isUserAuthorized, getUsers);

// Create new user
userRouter.post('/create', isUserAuthorized, createNewUser);

userRouter
    .route('/:id')
    .get(isUserAuthorized, getUserById)
    .put(isUserAuthorized, updateUserById)
    .delete(isUserAuthorized, deleteUserById);

module.exports = userRouter;
