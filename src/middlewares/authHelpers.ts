import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import { Token } from '../models/token.model';
import { JWT } from '../mockedData';

interface UserProps {
    id: string;
    login: string;
    age: number;
}

interface AccessToken {
    type: 'access',
    payload: UserProps
}

const generateAccessToken = (payload: UserProps) => jwt.sign({ type: 'access', payload }, JWT.secret, { expiresIn: JWT.tokens.access.expiresIn });
const generateRefreshToken = () => {
    const payload = {
        id: uuidv4(),
        type: JWT.tokens.refresh.type
    };

    return {
        id: payload.id,
        token: jwt.sign(payload, JWT.secret, { expiresIn: JWT.tokens.refresh.expiresIn })
    };
};

const replaceDbRefreshToken = async (tokenId: string, userId: string) => {
    try {
        const token = await Token.findOne({
            where: {
                userId
            }
        });
        if (!token) {
            return Token.create({ tokenId, userId });
        }
        return await Token.update({ tokenId }, {
            where: { userId }
        });
    } catch (e) {
        throw e;
    }
};

export const updateTokens = (payload: UserProps) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken();

    return replaceDbRefreshToken(refreshToken.id, payload.id).then(() => ({
        accessToken,
        refreshToken: refreshToken.token
    }));
};

export const isUserAuthorized = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string | string[] = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const payload = <AccessToken>jwt.verify(token as string, JWT.secret);
        if (payload.type !== 'access') {
            return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
        }

        return next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            res.status(400).json({ success: false, message: 'Token Expired' });
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ success: false, message: 'Invalid Token' });
        }
    }
};
