import { userLoginSchema } from '../services/validation';
import { loginUser, User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { JWT } from '../mockedData';
import { Token } from '../models/token.model';
import { updateTokens } from '../middlewares';
import express from 'express';

export const authRouter: express.Router = express.Router();

// Login
authRouter.post('/login', async (req, res) => {
    const { error, value } = userLoginSchema.validate(req.body);
    // Body validation
    if (!error) {
        try {
            const tokens = await loginUser(value);
            res.json({ success: true, tokens });
        } catch (e) {
            res.status(404).json({ success: false, message: e.message });
        }
    } else {
        res.status(400).json({ success: false, message: error });
    }
});

// Refresh - Tokens
authRouter.post('/refresh-tokens', async (req, res) => {
    const refreshToken: string | string[] = req.headers['x-refresh-token'];
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const payload = <{ id: string, type: string }>jwt.verify(refreshToken as string, JWT.secret);
        if (payload.type !== 'refresh') {
            res.status(400).json({ success: false, message: 'Invalid Token' });
        }
        const token = await Token.findOne({
            where: {
                tokenId: payload.id
            }
        });
        if (!token) {
            res.status(400).json({ success: false, message: 'Invalid Token' });
        }
        const user = await User.findOne({
            where: {
                id: token.userId
            }
        });
        const tokens = await updateTokens({ id: user.id, age: user.age, login: user.login });
        res.json({ success: true, tokens });
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            res.status(400).json({ success: false, message: 'Token Expired' });
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ success: false, message: 'Invalid Token' });
        }
    }
});
