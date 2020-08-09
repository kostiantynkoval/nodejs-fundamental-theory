import express  from 'express';
import { v4 as uuidv4 } from 'uuid';

const app: express.Application = express();

interface User {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

const users: User[] = [
    {
        id: uuidv4(),
        login: 'Test1',
        password: 'test1',
        age: 24,
        isDeleted: false
    },
    {
        id: uuidv4(),
        login: 'Test2',
        password: 'test2',
        age: 34,
        isDeleted: true
    },
    {
        id: uuidv4(),
        login: 'Test3',
        password: 'test3',
        age: 29,
        isDeleted: false
    }
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.listen(3000, () => {
    console.log('App is listening on port 3000!');
});
