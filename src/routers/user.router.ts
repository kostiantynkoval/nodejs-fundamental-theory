import express from 'express';
import { getAutoSuggestUsers, getAllUsersWithDeleted, getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../models/user.model';
import { userSchema, userUpdateSchema } from '../services/validation';
import { isUserAuthorized } from '../middlewares';

const userRouter: express.Router = express.Router();

// Get all not deleted users
userRouter.get('/', isUserAuthorized,  async (req, res) => {
    try {
        // Filter users by string, sort, and return limited items
        if (!!req.query.search || !!req.query.limit) {
            const users = await getAutoSuggestUsers(req.query.search as string, req.query.limit as string);
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
        res.json({ error: 'Error during fetching users' });
    }
});

// Create new user
userRouter.post('/create', isUserAuthorized, async (req, res) => {
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
    .get(isUserAuthorized, async (req, res) => {
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
    .put(isUserAuthorized, async (req, res) => {
        const { error, value } = userUpdateSchema.validate(req.body);
        if (!error) {
            try {
                await updateUser(value, req.params.id);
                res.json({ message: `User: ${ value.login } is updated successfully` });
            } catch (e) {
                if (e.original && e.original.code === '23505') {
                    return res.status(400).json({ error: { message: `Bad request: ${ e.errors[0].message }` } });
                }
                return res.status(500).json({ error: e });
            }
        } else {
            res.status(400).json({ error });
        }
    })
    // Delete item by id
    .delete(isUserAuthorized, async (req, res) => {
        try {
            await deleteUser(req.params.id);
            res.json({ message: 'User is deleted successfully' });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

module.exports = userRouter;
