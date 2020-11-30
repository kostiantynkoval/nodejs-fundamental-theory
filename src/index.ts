import { sequelize } from './data-access/db';
import { uncaughtErrorsHandler } from './middlewares';
import { app } from "./app";

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

process.on('uncaughtException', uncaughtErrorsHandler);
process.on('unhandledRejection', uncaughtErrorsHandler);
