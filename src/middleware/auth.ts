import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';
import { UserService } from '../service/UserService.js';
import { UserStatus } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                status: UserStatus;
            };
        }
    }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                error: 'Access token required',
                redirect: '/login'
            });
        }

        const token = authHeader.substring(7);
        const payload = verifyToken(token);

        const user = await UserService.getUserById(payload.userId);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: 'User account not found',
                redirect: '/login'
            });
        }

        if (user.status === UserStatus.BLOCKED) {
            return res.status(403).json({ 
                success: false, 
                error: 'User account is blocked',
                redirect: '/login'
            });
        }

        req.user = {
            userId: user.id,
            email: user.email,
            status: user.status
        };

        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            error: 'Invalid or expired token',
            redirect: '/login'
        });
    }
}