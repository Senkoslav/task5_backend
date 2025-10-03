import { UserService } from "../service/UserService.js";
import { generateToken } from "../utils/auth.js";
import { toDto } from "../utils/user-mapper.js";
export class UserController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    error: "Name, email, and password are required"
                });
            }
            if (password.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Password cannot be empty"
                });
            }
            const user = await UserService.createUser(name, email, password);
            return res.status(201).json({
                success: true,
                data: user,
                message: "User registered successfully. Please check your email for verification."
            });
        }
        catch (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: "Email and password are required"
                });
            }
            const user = await UserService.loginUser(email, password);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid email or password"
                });
            }
            const token = generateToken({
                userId: user.id,
                email: user.email,
                status: user.status
            });
            return res.json({
                success: true,
                token,
                user: toDto(user),
                message: "Login successful"
            });
        }
        catch (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
    }
    static async verifyEmail(req, res) {
        try {
            const userId = Number(req.params.id);
            const user = await UserService.verifyUser(userId);
            return res.json({
                success: true,
                data: user,
                message: "Email verified successfully"
            });
        }
        catch (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.json({ success: true, data: users });
        }
        catch (err) {
            return res.status(500).json({ success: false, error: "Failed to fetch users" });
        }
    }
    static async blockUsers(req, res) {
        try {
            const { userIds } = req.body;
            if (!Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "User IDs array is required"
                });
            }
            const count = await UserService.blockUsers(userIds);
            if (count === 0) {
                return res.status(400).json({
                    success: false,
                    error: "No users were blocked. They may already be blocked."
                });
            }
            return res.json({
                success: true,
                message: `${count} user(s) blocked successfully`,
                count
            });
        }
        catch (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
    }
    static async unblockUsers(req, res) {
        try {
            const { userIds } = req.body;
            if (!Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "User IDs array is required"
                });
            }
            const count = await UserService.unblockUsers(userIds);
            if (count === 0) {
                return res.status(400).json({
                    success: false,
                    error: "No users were unblocked. They may not be blocked."
                });
            }
            return res.json({
                success: true,
                message: `${count} user(s) unblocked successfully`,
                count
            });
        }
        catch (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
    }
    static async deleteUsers(req, res) {
        try {
            const { userIds } = req.body;
            if (!Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "User IDs array is required"
                });
            }
            const count = await UserService.deleteUsers(userIds);
            return res.json({
                success: true,
                message: `${count} users deleted successfully`,
                count
            });
        }
        catch (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
    }
    static async deleteUnverifiedUsers(req, res) {
        try {
            const count = await UserService.deleteUnverifiedUsers();
            return res.json({
                success: true,
                message: `${count} unverified users deleted successfully`,
                count
            });
        }
        catch (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
    }
}
//# sourceMappingURL=UserController.js.map