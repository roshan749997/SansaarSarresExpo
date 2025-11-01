import { Router } from 'express';
import { signup, signin, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email createdAt updatedAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load profile' });
  }
});

export default router;


