const express = require('express');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('username xp badges completedChapters streak')
      .sort({ xp: -1 })
      .limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress (complete chapter)
router.post('/complete-chapter', authMiddleware, async (req, res) => {
  try {
    const { chapterId, quizScore } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.completedChapters.includes(chapterId)) {
      user.completedChapters.push(chapterId);
      user.xp += 50;
      
      if (quizScore) {
        user.quizScores.push({ chapterId, score: quizScore });
        if (quizScore >= 70) {
          user.xp += 30;
        }
      }
      
      // Check badges
      const completedCount = user.completedChapters.length;
      if (completedCount >= 3 && !user.badges.includes('OSI Master')) {
        user.badges.push('OSI Master');
      }
      if (completedCount >= 5 && !user.badges.includes('Security Expert')) {
        user.badges.push('Security Expert');
      }
      if (completedCount >= 8 && !user.badges.includes('Course Finisher')) {
        user.badges.push('Course Finisher');
      }
      
      await user.save();
    }
    
    res.json({ 
      completedChapters: user.completedChapters, 
      xp: user.xp, 
      badges: user.badges 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all users
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

