import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { JwtPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const SALT_ROUNDS = 12;

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}