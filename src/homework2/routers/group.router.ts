import express from "express";
import { Group } from "../models/group.model";
import { Op } from "sequelize";
import { groupSchema } from "../services/validation";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user.model";

const groupRouter: express.Router = express.Router();

// Get all groups
groupRouter.get('/', async ( req, res) => {
    try {
        // Filter users by string, sort, and return limited items
        const groups = await Group.findAll();
        res.json(groups);
    } catch ( error ) {
        console.log("Error during fetching groups", error);
    }
});

// Create new user
groupRouter.post('/create', async (req, res) => {
    const { error, value } = groupSchema.validate(req.body);
    // Body validation
    if (!error) {
        try {
            const { name, permissions } = value;
            // Check if users array has duplicated login
            await Group.create({
                id: uuidv4(),
                name,
                permissions,
            });
            res.json({ message: 'Group has been created successfully' });
        } catch ( error ) {
            console.log("Error during creating a group: ", error)
            res.status(500).json({ error });
        }
    } else {
        res.status(400).json({ error });
    }
});

groupRouter
.route('/:id')
// // Get item by id
.get(async (req, res) => {
    try {
        const group = await Group.findOne({ where:{
                id: req.params.id
            } });
        // const foundedUser = users.find(user => user.id === req.params.id && !user.isDeleted);
        if (!group) {
            res.status(404).json({ message: 'Group is not found' });
        } else {
            res.json(group);
        }
    } catch ( error ) {
        console.log("Error during fetching a group: ", error)
        res.status(500).json({ error });
    }
})
// // Update item by id
.put(async (req, res) => {
    try {
        console.log("req.body", req.body)
        await Group.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json({ message: `Group has been updated successfully` });
    } catch ( e ) {
        if (e.original.code === "23505") {
            return res.status(400).json({ error: { message: "Bad request: " + e.errors[0].message } } );
        } else {
            return res.status(500).json({ error: e });
        }
    }
})
// // Delete item by id
// .delete(async (req, res) => {
//     try {
//         const user = await User.update({ isDeleted: true }, {
//             where: {
//                 id: req.params.id
//             }
//         });
//         console.log('deleted user', user)
//         res.json({ message: 'User is deleted successfully' });
//     } catch ( e ) {
//         res.status(400).json({ error: e });
//     }
// });

module.exports = groupRouter;
