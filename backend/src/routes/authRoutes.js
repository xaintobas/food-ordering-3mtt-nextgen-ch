import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  verifyAccount,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', protect, getMe);
router.get('/verify/:token', verifyAccount);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
