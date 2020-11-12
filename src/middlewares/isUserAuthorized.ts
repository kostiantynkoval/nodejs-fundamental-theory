import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { SECRET } from "../mockedData";

export const isUserAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const token: string | string[] = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).json({success: false, message: "No token provided"});
    }

    return jwt.verify(token as string, SECRET, err => {
        if(err) {
            return res.status(403).json({success: false, message: "Failed to authenticate token"});
        }
        return next();
    })
}
