import express from "express";
import { users } from "../users";
import { userSchema } from "../services/validation/User";
import { v4 as uuidv4 } from "uuid";
import { User } from "../User";

const userRouter: express.Router = express.Router();

// Check if users array has duplicated login
const checkIfExistingLogin = (login: string, userList: User[]) => userList.map(user => user.login).includes(login);

// Get all not deleted users
userRouter.get('/', ( req, res) => {
    // Filter users by string, sort, and return limited items
    if (!!req.query.search && !!req.query.limit) {
        const limit = parseInt(req.query.limit.toString(), 10) || 0;
        const regExp = new RegExp(`^${ req.query.search }`);
        const transformed = users.filter(user => regExp.test(user.login)).sort((a, b) => {
            if (a.login > b.login) return 1;
            if (a.login < b.login) return -1;
            return 0;
        }).slice(0, limit);
        res.json(transformed);
        // Show all users with deleted ones if there is query: showDeleted=true
    } else if (req.query.showDeleted === 'true') {
        res.json(users);
    } else {
        res.json(users.filter(user => !user.isDeleted));
    }
});

// Create new user
userRouter.post('/create', (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    // Body validation
    if (!error) {
        const { login, password, age } = value;
        // Check if users array has duplicated login
        if (checkIfExistingLogin(login, users)) {
            res.status(400).json({ message: 'User already exists' });
        } else {
            users.push({
                id: uuidv4(),
                login,
                password,
                age,
                isDeleted: false
            });
            res.json({ message: 'User created successfully' });
        }
    } else {
        res.status(400).json({ error });
    }
});

userRouter
.route('/:id')
// Get item by id
.get((req, res) => {
    const foundedUser = users.find(user => user.id === req.params.id && !user.isDeleted);
    if (!foundedUser) {
        res.status(404).json({ message: 'User is not found' });
    } else {
        res.json(foundedUser);
    }
})
// Update item by id
.put((req, res) => {
    const { error, value } = userSchema.validate(req.body);
    // Body validation
    if (!error) {
        const { login, password, age } = value;
        const index = users.findIndex(user => user.id === req.params.id);
        if (index > -1) {
            // Check if users array has duplicated login (except same user)
            if (users[index].login !== login && checkIfExistingLogin(login, users)) {
                res.status(400).json({ message: 'This login is taken already' });
            } else {
                const updated = {
                    id: req.params.id,
                    login,
                    password,
                    age,
                    isDeleted: users[index].isDeleted
                };
                users.splice(index, 1, updated);
                res.json({ message: `User ${ updated.login } is updated successfully` });
            }
        } else {
            res.status(404).json({ message: 'User is not found' });
        }
    } else {
        res.status(400).json({ error: error.details });
    }
})
// Delete item by id
.delete((req, res) => {
    const index = users.findIndex(user => user.id === req.params.id);
    if (index > -1) {
        if (users[index].isDeleted) {
            res.status(400).json({ message: `User ${ users[index].login } is already deleted` });
        } else {
            users[index].isDeleted = true;
            res.json({ message: `User ${ users[index].login } is deleted successfully` });
        }
    } else {
        res.status(404).json({ message: 'User is not found' });
    }
});

module.exports = userRouter;
