const express = require('express');
const Course = require('../models/Course');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all chapters
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne().sort({ createdAt: -1 });
    if (!course) return res.json({ chapters: [] });
    res.json({ chapters: course.chapters.sort((a, b) => a.order - b.order) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single chapter
router.get('/:chapterId', async (req, res) => {
  try {
    const course = await Course.findOne({ 'chapters.id': req.params.chapterId });
    if (!course) return res.status(404).json({ message: 'Chapter not found' });
    const chapter = course.chapters.find(c => c.id === req.params.chapterId);
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz
router.post('/:chapterId/quiz', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const course = await Course.findOne({ 'chapters.id': req.params.chapterId });
    if (!course) return res.status(404).json({ message: 'Chapter not found' });
    
    const chapter = course.chapters.find(c => c.id === req.params.chapterId);
    let correct = 0;
    const results = chapter.quiz.map((q, idx) => {
      const isCorrect = answers[idx] === q.correctIndex;
      if (isCorrect) correct++;
      return {
        question: q.question,
        correct: isCorrect,
        correctAnswer: q.options[q.correctIndex],
        explanation: q.explanation
      };
    });

    const score = Math.round((correct / chapter.quiz.length) * 100);
    const passed = score >= 70;

    res.json({ score, passed, correct, total: chapter.quiz.length, results });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create chapter
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    let course = await Course.findOne();
    if (!course) {
      course = new Course({ title: 'Réseaux Informatiques', chapters: [req.body] });
    } else {
      course.chapters.push(req.body);
    }
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update chapter
router.put('/:chapterId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const course = await Course.findOne();
    const idx = course.chapters.findIndex(c => c.id === req.params.chapterId);
    if (idx === -1) return res.status(404).json({ message: 'Chapter not found' });
    course.chapters[idx] = { ...course.chapters[idx].toObject(), ...req.body };
    await course.save();
    res.json(course.chapters[idx]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete chapter
router.delete('/:chapterId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const course = await Course.findOne();
    course.chapters = course.chapters.filter(c => c.id !== req.params.chapterId);
    await course.save();
    res.json({ message: 'Chapter deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

