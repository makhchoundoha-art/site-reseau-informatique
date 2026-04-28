const express = require('express');
const Exercise = require('../models/Exercise');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all exercises (with filters)
router.get('/', async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    
    const exercises = await Exercise.find(filter).sort({ createdAt: -1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get daily challenge
router.get('/daily', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let exercise = await Exercise.findOne({ isDailyChallenge: true, challengeDate: { $gte: today } });
    
    if (!exercise) {
      const count = await Exercise.countDocuments();
      const random = Math.floor(Math.random() * count);
      exercise = await Exercise.findOne().skip(random);
      
      if (exercise) {
        await Exercise.updateMany({ isDailyChallenge: true }, { isDailyChallenge: false, challengeDate: null });
        exercise.isDailyChallenge = true;
        exercise.challengeDate = new Date();
        await exercise.save();
      }
    }
    
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single exercise
router.get('/:exerciseId', async (req, res) => {
  try {
    const exercise = await Exercise.findOne({ id: req.params.exerciseId });
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark exercise as solved
router.post('/:exerciseId/solve', authMiddleware, async (req, res) => {
  try {
    const exercise = await Exercise.findOne({ id: req.params.exerciseId });
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
    
    const user = await User.findById(req.user.id);
    
    if (!user.exercisesSolved.includes(req.params.exerciseId)) {
      user.exercisesSolved.push(req.params.exerciseId);
      
      let xpEarned = exercise.xpReward;
      
      // Bonus for daily challenge
      if (exercise.isDailyChallenge && !user.dailyChallengeCompleted) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (exercise.challengeDate >= today) {
          xpEarned += 15;
          user.dailyChallengeCompleted = true;
          user.dailyChallengeDate = new Date();
        }
      }
      
      user.xp += xpEarned;
      
      // Check badges
      const exerciseCount = user.exercisesSolved.length;
      if (exerciseCount >= 5 && !user.badges.includes('Subnet Pro')) {
        user.badges.push('Subnet Pro');
      }
      if (exerciseCount >= 10 && !user.badges.includes('Quiz Champion')) {
        user.badges.push('Quiz Champion');
      }
      
      await user.save();
    }
    
    res.json({ xpEarned: exercise.xpReward, totalXp: user.xp, badges: user.badges });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create exercise
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update exercise
router.put('/:exerciseId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const exercise = await Exercise.findOneAndUpdate(
      { id: req.params.exerciseId },
      req.body,
      { new: true }
    );
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete exercise
router.delete('/:exerciseId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    await Exercise.findOneAndDelete({ id: req.params.exerciseId });
    res.json({ message: 'Exercise deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

