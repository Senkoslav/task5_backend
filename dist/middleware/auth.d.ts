import type { Request, Response, NextFunction } from 'express';
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
export declare function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
