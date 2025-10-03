import type { Request, Response } from "express";
export declare class UserController {
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static verifyEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAllUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static blockUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static unblockUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteUnverifiedUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
