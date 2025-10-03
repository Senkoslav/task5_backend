import { UserStatus } from "@prisma/client";

export interface UserDto {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  lastLogin: Date | null;
  createdAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserDto;
  message?: string;
}

export interface BulkOperationRequest {
  userIds: number[];
}

export interface JwtPayload {
  userId: number;
  email: string;
  status: UserStatus;
}