const express = require('express');
const Progress = require('../models/Progress');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Get user progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get progress for specific chapter
router.get('/:chapterId', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findOne({ 
      userId: req.user.id, 
      chapterId: req.params.chapterId 
    });
    res.json(progress || { userId: req.user.id, chapterId: req.params.chapterId, completed: false, exercisesSolved: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { chapterId, completed, exerciseId } = req.body;
    
    let progress = await Progress.findOne({ userId: req.user.id, chapterId });
    
    if (!progress) {
      progress = new Progress({ userId: req.user.id, chapterId, completed: false, exercisesSolved: [] });
    }
    
    if (completed !== undefined) {
      progress.completed = completed;
      if (completed) progress.completedAt = new Date();
    }
    
    if (exerciseId && !progress.exercisesSolved.includes(exerciseId)) {
      progress.exercisesSolved.push(exerciseId);
    }
    
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

