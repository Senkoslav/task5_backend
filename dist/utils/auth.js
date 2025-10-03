import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const SALT_ROUNDS = 12;
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
export async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
//# sourceMappingURL=auth.js.map