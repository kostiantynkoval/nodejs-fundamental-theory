// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import { sequelize } from '../data-access/db';

// FIXME: I don't understand why `logError` and `finalErrorHandler` middlewares are not working

export const logError = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log('$$$$$$$$$$$$$$$ Error:  ');
    console.error(err.stack);
    next(err);
};

export const finalErrorHandler = (err: any, req: Request, res: Response) => {
    res.status(500);
    res.render('error', { error: err });
};

export const uncaughtErrorsHandler = async (...args: any) => {
    console.log('@@@@@@@@@@@@@@@@@@ Uncaught Exception @@@@@@@@@@@@@@@@@@@@');
    console.error(args);

    await sequelize.close();
    process.exit(1);
};
