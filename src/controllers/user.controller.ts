import { createUser, getAllUsers, getAllUsersWithDeleted, getAutoSuggestUsers, fetchUserById, updateUser, deleteUser } from '../models/user.model';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { userSchema, userUpdateSchema } from '../services/validation';

export const getUsers = async (req: Request, res: Response) => {
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
};

export const createNewUser = async (req: Request, res: Response) => {
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
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await fetchUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User is not found' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.log('Error during fetching a user: ', error);
        res.status(500).json({ error });
    }
};

export const updateUserById = async (req: Request, res: Response) => {
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
};

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        await deleteUser(req.params.id);
        res.json({ message: 'User is deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e });
    }
};
