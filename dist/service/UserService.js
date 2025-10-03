import { UserStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../utils/auth.js";
import { toDto } from "../utils/user-mapper.js";
import { emailService } from "../utils/email.js";
export class UserService {
    // IMPORTANT: Create new user with email verification
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
            // NOTE: Send verification email asynchronously as required
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
    // IMPORTANT: User login with password verification
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
        // NOTE: Update last login time
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        return user;
    }
    // NOTE: Get all users sorted by last login time as required by task
    static async getAllUsers() {
        const users = await prisma.user.findMany({
            orderBy: [
                { lastLogin: { sort: 'desc', nulls: 'last' } },
                { createdAt: 'desc' }
            ],
        });
        return users.map(toDto);
    }
    // IMPORTANT: Get user by ID for authentication checks
    static async getUserById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    // NOTE: Verify user email (change status from UNVERIFIED to ACTIVE)
    static async verifyUser(userId) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.ACTIVE },
        });
        return toDto(user);
    }
    // IMPORTANT: Block single user
    static async blockUser(userId) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.BLOCKED },
        });
        return toDto(user);
    }
    // IMPORTANT: Unblock single user
    static async unblockUser(userId) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: UserStatus.ACTIVE },
        });
        return toDto(user);
    }
    // IMPORTANT: Delete single user (actual deletion, not marking)
    static async deleteUser(userId) {
        await prisma.user.delete({
            where: { id: userId },
        });
    }
    // IMPORTANT: Bulk operations for toolbar actions
    static async blockUsers(userIds) {
        const result = await prisma.user.updateMany({
            where: { id: { in: userIds } },
            data: { status: UserStatus.BLOCKED },
        });
        return result.count;
    }
    static async unblockUsers(userIds) {
        const result = await prisma.user.updateMany({
            where: { id: { in: userIds } },
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
    // NOTA BENE: Delete unverified users as required by toolbar
    static async deleteUnverifiedUsers() {
        const result = await prisma.user.deleteMany({
            where: { status: UserStatus.UNVERIFIED },
        });
        return result.count;
    }
}
//# sourceMappingURL=UserService.js.map