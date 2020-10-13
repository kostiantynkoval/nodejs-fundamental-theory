import express from "express";
import { User } from "../models/user.model";
import { Op } from "sequelize";
import { userSchema } from "../services/validation/User";
import { v4 as uuidv4 } from "uuid";

const userRouter: express.Router = express.Router();

// Check if users array has duplicated login
const checkIfExistingLogin = (login: string, userList: any) => userList.map((user:any) => user.login).includes(login);

// Get all not deleted users
userRouter.get('/', async ( req, res) => {
    try {
        // Filter users by string, sort, and return limited items
        if (!!req.query.search || !!req.query.limit) {
            const users = await User.findAll({
                ...req.query.search && {
                    where: {
                        [Op.and]: {
                            login: {
                                [Op.regexp]: `^${req.query.search}`,
                            },
                            isDeleted: false,
                        }
                    }
                },
                order: [
                    ["login", "ASC"],
                ],
                ...req.query.limit && { limit: +req.query.limit },
            });
            res.json(users);
            // Show all users with deleted ones if there is query: showDeleted=true
        } else if (req.query.showDeleted === 'true') {
            const users: any[] = await User.findAll({
                order: [
                    ["login", "DESC"],
                ],
            });
            res.json(users);
        } else {
            const users = await User.findAll({
                order: [
                    ["login", "DESC"],
                ],
                where: {
                    isDeleted: false,
                }
            });
            res.json(users);
        }
    } catch ( error ) {
        console.log("Error during fetching users", error);
    }
});

// Create new user
userRouter.post('/create', async (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    const users = await User.findAll();
    // Body validation
    if (!error) {
        const { login, password, age } = value;
        // Check if users array has duplicated login
        // FIXME: Check whether this functionality is needed here
        if (checkIfExistingLogin(login, users)) {
            res.status(400).json({ message: 'User already exists' });
        } else {
            try {
                await User.create({
                    id: uuidv4(),
                    login,
                    password,
                    age,
                    isDeleted: false
                });
                res.json({ message: 'User created successfully' });
            } catch ( e ) {
                console.log("Error during creating a user: ", error)
                res.status(500).json({ error: e });
            }
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
        const user = await User.findOne({ where:{
                id: req.params.id
            } });
        if (!user) {
            res.status(404).json({ message: 'User is not found' });
        } else {
            res.json(user);
        }
    } catch ( error ) {
        console.log("Error during fetching a user: ", error)
        res.status(500).json({ error });
    }
})
// Update item by id
.put(async (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    if (!error) {
        try {
            await User.update(value, {
                where: {
                    id: req.params.id
                }
            });
            res.json({ message: `User: ${ value.login } is updated successfully` });
        } catch ( e ) {
            if (e.original.code === "23505") {
                return res.status(400).json({ error: { message: "Bad request: " + e.errors[0].message } } );
            } else {
                return res.status(500).json({ error: e });
            }
        }
    } else {
        res.status(400).json({ error });
    }
})
// Delete item by id
.delete(async (req, res) => {
    try {
        await User.update({ isDeleted: true }, {
            where: {
                id: req.params.id
            }
        });
        res.json({ message: 'User is deleted successfully' });
    } catch ( e ) {
        res.status(500).json({ error: e });
    }
});

module.exports = userRouter;
