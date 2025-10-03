import { Router } from 'express';
import { UserController } from '../controller/UserController.js';
const router = Router();
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/verify/:id', UserController.verifyEmail);
export default router;
//# sourceMappingURL=auth.js.map