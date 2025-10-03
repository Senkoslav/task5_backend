import { Router } from 'express';
import { UserController } from '../controller/UserController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.get('/', UserController.getAllUsers);

router.post('/block', UserController.blockUsers);
router.post('/unblock', UserController.unblockUsers);
router.post('/delete', UserController.deleteUsers);

export default router;