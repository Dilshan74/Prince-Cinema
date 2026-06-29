import express from 'express';
import { signup, signin, getCurrentUser } from '../controllers/authControllers.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', verifyToken, getCurrentUser);

export default router;
