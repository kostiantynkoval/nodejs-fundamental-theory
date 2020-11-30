import express from 'express';
import { addUsersToGroup, createNewGroup, deleteGroupById, getGroupById, getGroups, updateGroupById } from '../controllers/groups.controller';

export const groupRouter: express.Router = express.Router();

// Get all groups
groupRouter.get('/', getGroups);

// Create new group
groupRouter.post('/create', createNewGroup);

groupRouter
    .route('/:id')
    .get(getGroupById)
    .put(updateGroupById)
    .delete(deleteGroupById)
    .post(addUsersToGroup);
