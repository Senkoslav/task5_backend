import type { User } from "@prisma/client";
import type { UserDto } from "../types/index.js";
export declare function toDto(user: User): UserDto;
export declare function getUniqIdValue(): string;
