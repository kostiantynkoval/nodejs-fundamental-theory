import express from 'express';
import cors from 'cors';
import { logRequest, logError, finalErrorHandler } from './middlewares';
// import { User } from './models/user.model';
// import { Group } from './models/group.model';
// import { Token } from './models/token.model';
// import { users, groups } from './mockedData';
import { userRouter } from './routers/user.router';
import { groupRouter } from './routers/group.router';
import { authRouter } from './routers/auth.router';

export const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/groups', groupRouter);
app.use(logError);
app.use(finalErrorHandler);

// To create a tables and fill them in with data
// await Group.sync({ force: true })
// users.forEach(async (user) => {
//     await User.create(user)
// })zxm,./
// groups.forEach(async (group) => {
//     await Group.create(group as any)
// })
