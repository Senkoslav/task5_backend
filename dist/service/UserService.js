import { UserStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../utils/auth.js";
import { toDto } from "../utils/user-mapper.js";
import { emailService } from "../utils/email.js";
export class UserService {
    static async createUser(name, email, password) {
        const passwordHash = await hashPassword(password);
        try {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    status: UserStatus.UNVERIFIED,
                },
            });
            emailService.sendVerificationEmail(email, user.id).catch(console.error);
            return toDto(user);
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }
    static async loginUser(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return null;
        }
        if (user.status === UserStatus.BLOCKED) {
            throw new Error('User account is blocked');
        }
        const isValidPassword = await verifyPassword(password, user.passwordHash);
        if (!isValidPassword) {
            return null;
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        return user;
    }
    static async getAllUsers() {
        const users = await prisma.user.findMany({
            orderBy: [
                { lastLogin: { sort: 'desc', nulls: 'last' } },
                { createdAt: 'desc' }
            ],
        });
        return users.map(toDto);
    }
    static async getUserById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    static async verifyUser(userId) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.ACTIVE },
        });
        return toDto(user);
    }
    static async blockUser(userId) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.BLOCKED },
        });
        return toDto(user);
    }
    static async unblockUser(userId) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.ACTIVE },
        });
        return toDto(user);
    }
    static async deleteUser(userId) {
        await prisma.user.delete({
            where: { id: userId },
        });
    }
    static async blockUsers(userIds) {
        const result = await prisma.user.updateMany({
            where: {
                id: { in: userIds },
                status: { not: UserStatus.BLOCKED }
            },
            data: { status: UserStatus.BLOCKED },
        });
        return result.count;
    }
    static async unblockUsers(userIds) {
        const result = await prisma.user.updateMany({
            where: {
                id: { in: userIds },
                status: UserStatus.BLOCKED
            },
            data: { status: UserStatus.ACTIVE },
        });
        return result.count;
    }
    static async deleteUsers(userIds) {
        const result = await prisma.user.deleteMany({
            where: { id: { in: userIds } },
        });
        return result.count;
    }
    static async deleteUnverifiedUsers() {
        const result = await prisma.user.deleteMany({
            where: { status: UserStatus.UNVERIFIED },
        });
        return result.count;
    }
}
//# sourceMappingURL=UserService.js.map