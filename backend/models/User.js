const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  xp: { type: Number, default: 0 },
  badges: [{ type: String }],
  completedChapters: [{ type: String }],
  quizScores: [quizScoreSchema],
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  dailyChallengeCompleted: { type: Boolean, default: false },
  dailyChallengeDate: { type: Date, default: null },
  exercisesSolved: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

