import express from 'express';
import { sequelize } from './data-access/db';
import cors from 'cors';
import { logRequest, logError, uncaughtErrorsHandler, finalErrorHandler } from "./middlewares";
// import { User } from './models/user.model';
// import { Group } from './models/group.model';
// import { users, groups } from './mockedData';

const userRouter = require('./routers/user.router');
const groupRouter = require('./routers/group.router');
const app: express.Application = express();

sequelize
    .sync()
    .then(async () => {
        try {
            app.listen(3000, () => {
                console.log('App is listening on port 3000! And DB is connected');
            });
        } catch (e) {
            console.log('Error: Can\'t run server. ', e);
        }
    })
    .catch(e => console.log('Error: Can\'t connect to db. ', e));

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use('/api/users', userRouter);
app.use('/api/groups', groupRouter);
app.use(logError);
app.use(finalErrorHandler);

console.log(process.argv);

process.on('uncaughtException', uncaughtErrorsHandler);
process.on('unhandledRejection', uncaughtErrorsHandler);

// To create a tables and fill them in with data
// await Group.sync({ force: true })
// users.forEach(async (user) => {
//     await User.create(user)
// })zxm,./
// groups.forEach(async (group) => {
//     await Group.create(group as any)
// })
