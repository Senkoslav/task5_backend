import type { JwtPayload } from '../types/index.js';
export declare function generateToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
