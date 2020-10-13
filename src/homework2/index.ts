import express from 'express';
import { sequelize } from "./data-access/db";
import { Group } from "./models/group.model";

const userRouter = require('./routers/user.router');
const groupRouter = require('./routers/group.router');

const app: express.Application = express();

sequelize
    .authenticate()
    .then(async () => {
        try {
            app.listen(3000, () => {
                console.log('App is listening on port 3000! And DB is connected');
            })
        } catch ( e ) {
            console.log("Error@@@", e);
        }
    })
    .catch(e => console.log("Error: ", e));

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/groups', groupRouter);

// To create a table
// await Group.sync({ force: true })
