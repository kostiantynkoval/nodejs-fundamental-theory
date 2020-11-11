import express from 'express';
import { getAllGroups, createGroup, getGroupById, updateGroup, deleteGroup } from '../models/group.model';
import { groupSchema } from '../services/validation';

const groupRouter: express.Router = express.Router();

// Get all groups
groupRouter.get('/', async (req, res) => {
    try {
        // Filter users by string, sort, and return limited items
        const groups = await getAllGroups();
        res.json(groups);
    } catch (error) {
        console.log('Error during fetching groups', error);
    }
});

// Create new group
groupRouter.post('/create', async (req, res) => {
    const { error, value } = groupSchema.validate(req.body);
    // Body validation
    if (!error) {
        try {
            await createGroup(value);
            res.json({ message: 'Group has been created successfully' });
        } catch (err) {
            console.log('Error during creating a group: ', err);
            res.status(500).json({ err });
        }
    } else {
        // FIXME: remove throwing error
        throw new Error(error.message)
        // res.status(400).json({ error });
    }
});

groupRouter
    .route('/:id')
    // Get group by id
    .get(async (req, res) => {
        try {
            const group = getGroupById(req.params.id);
            if (!group) {
                res.status(404).json({ message: 'Group is not found' });
            } else {
                res.json(group);
            }
        } catch (error) {
            console.log('Error during fetching a group: ', error);
            res.status(500).json({ error });
        }
    })
    // Update item by id
    .put(async (req, res) => {
        if (Object.keys(req.body).length > 0) {
            try {
                await updateGroup(req.body, req.params.id);
                res.json({ message: 'Group has been updated successfully' });
            } catch (e) {
                if (e.original.code === '23505') {
                    return res.status(400).json({ error: { message: `Bad request: ${ e.errors[0].message }` } });
                }
                return res.status(500).json({ error: e });
            }
        } else {
            return res.status(400).json({ error: { message: 'Bad request: No items to update' } });
        }
    })
    // Delete item by id
    .delete(async (req, res) => {
        try {
            await deleteGroup(req.params.id);
            res.json({ message: 'Group is deleted successfully' });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    })
    // Add users to a group
    .post(async (req, res) => {
        const { userIds }: { userIds: string[]} = req.body;
        if (userIds.length > 0) {
            try {
                console.log('userIds', userIds);
                const group = await getGroupById(req.params.id);
                await group?.addUsers(userIds);
                res.json({ message: 'Users added successfully' });
            } catch (e) {
                if (e.original.code === '23505') {
                    return res.status(400).json({ error: { message: `Bad request: ${ e.errors[0].message }` } });
                }
                return res.status(500).json({ error: e });
            }
        } else {
            return res.status(400).json({ error: { message: 'Bad request: No items to update' } });
        }
    });

module.exports = groupRouter;
