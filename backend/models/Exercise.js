const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const exerciseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  problemStatement: { type: String, required: true },
  solution: [stepSchema],
  xpReward: { type: Number, default: 20 },
  tags: [{ type: String }],
  isDailyChallenge: { type: Boolean, default: false },
  challengeDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);

