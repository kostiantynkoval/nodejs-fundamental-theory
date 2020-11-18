// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
    console.info(`${req.method} ${req.url}`);
    console.info('REQ BODY: ', req.body);
    next();
};
