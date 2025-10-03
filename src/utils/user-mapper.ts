import type { User } from "@prisma/client";
import type { UserDto } from "../types/index.js";

export function toDto(user: User): UserDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
    };
}

export function getUniqIdValue(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}