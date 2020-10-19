import express from 'express';
import { getAutoSuggestUsers, getAllUsersWithDeleted, getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../models/user.model';
import { userSchema, userUpdateSchema } from '../services/validation';

const userRouter: express.Router = express.Router();

// Get all not deleted users
userRouter.get('/', async (req, res) => {
    try {
        // Filter users by string, sort, and return limited items
        if (!!req.query.search || !!req.query.limit) {
            // FIXME: Didn't find another way how to convert ParsedQs to string | undefined
            const users = await getAutoSuggestUsers(req.query.search as string | undefined, req.query.limit as string | undefined);
            res.json(users);
            // Show all users with deleted ones if there is query: showDeleted=true
        } else if (req.query.showDeleted === 'true') {
            const users = await getAllUsersWithDeleted();
            res.json(users);
        } else {
            const users = await getAllUsers();
            res.json(users);
        }
    } catch (error) {
        console.log('Error during fetching users', error);
    }
});

// Create new user
userRouter.post('/create', async (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    // Body validation
    if (!error) {
        try {
            await createUser(value);
            res.json({ message: 'User created successfully' });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    } else {
        res.status(400).json({ error });
    }
});

userRouter
    .route('/:id')
    // Get item by id
    .get(async (req, res) => {
        try {
            const user = await getUserById(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'User is not found' });
            } else {
                res.json(user);
            }
        } catch (error) {
            console.log('Error during fetching a user: ', error);
            res.status(500).json({ error });
        }
    })
    // Update item by id
    .put(async (req, res) => {
        const { error, value } = userUpdateSchema.validate(req.body);
        if (!error) {
            try {
                await updateUser(value, req.params.id);
                res.json({ message: `User: ${ value.login } is updated successfully` });
            } catch (e) {
                if (e.original.code === '23505') {
                    return res.status(400).json({ error: { message: `Bad request: ${ e.errors[0].message }` } });
                }
                return res.status(500).json({ error: e });
            }
        } else {
            res.status(400).json({ error });
        }
    })
    // Delete item by id
    .delete(async (req, res) => {
        try {
            await deleteUser(req.params.id);
            res.json({ message: 'User is deleted successfully' });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

module.exports = userRouter;
