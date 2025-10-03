import type { User } from "@prisma/client";
import type { UserDto } from "../types/index.js";
export declare class UserService {
    static createUser(name: string, email: string, password: string): Promise<UserDto>;
    static loginUser(email: string, password: string): Promise<User | null>;
    static getAllUsers(): Promise<UserDto[]>;
    static getUserById(id: number): Promise<User | null>;
    static verifyUser(userId: number): Promise<UserDto>;
    static blockUser(userId: number): Promise<UserDto>;
    static unblockUser(userId: number): Promise<UserDto>;
    static deleteUser(userId: number): Promise<void>;
    static blockUsers(userIds: number[]): Promise<number>;
    static unblockUsers(userIds: number[]): Promise<number>;
    static deleteUsers(userIds: number[]): Promise<number>;
    static deleteUnverifiedUsers(): Promise<number>;
}
