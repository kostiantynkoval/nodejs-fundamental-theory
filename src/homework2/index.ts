import express from 'express';
import { dbConfig } from "./data-access/db";
const userRouter = require('./routers/user.router');

const app: express.Application = express();

dbConfig
    .authenticate()
    .then(() => {
        app.listen(3000, () => {
            console.log('App is listening on port 3000! And DB is connected');
        })
    })
    .catch(e => console.log("Error: ", e));

app.use(express.json());
app.use('/api/users', userRouter);


