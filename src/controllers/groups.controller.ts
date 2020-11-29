import { createGroup, deleteGroup, fetchGroupById, getAllGroups, updateGroup } from '../models/group.model';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import { groupSchema } from '../services/validation';

export const getGroups = async (req: Request, res: Response) => {
    try {
        // Filter users by string, sort, and return limited items
        const groups = await getAllGroups();
        res.json(groups);
    } catch (error) {
        console.log('Error during fetching groups', error);
    }
};

export const createNewGroup = async (req: Request, res: Response) => {
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
        res.status(400).json({ error });
    }
};

export const getGroupById = async (req: Request, res: Response) => {
    try {
        const group = fetchGroupById(req.params.id);
        if (!group) {
            res.status(404).json({ message: 'Group is not found' });
        } else {
            res.json(group);
        }
    } catch (error) {
        console.log('Error during fetching a group: ', error);
        res.status(500).json({ error });
    }
};

export const updateGroupById = async (req: Request, res: Response) => {
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
};

export const deleteGroupById = async (req: Request, res: Response) => {
    try {
        await deleteGroup(req.params.id);
        res.json({ message: 'Group is deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e });
    }
};

export const addUsersToGroup = async (req: Request, res: Response) => {
    const { userIds }: { userIds: string[]} = req.body;
    if (userIds.length > 0) {
        try {
            console.log('userIds', userIds);
            const group = await fetchGroupById(req.params.id);
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
};
