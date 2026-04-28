const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
});

const chapterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  content: { type: String, required: true },
  summaryPdfUrl: { type: String, default: '' },
  quiz: [quizQuestionSchema],
  xpReward: { type: Number, default: 50 },
  duration: { type: String, default: '30 min' }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'Réseaux Informatiques' },
  description: { type: String, default: 'Cours complet sur les réseaux informatiques' },
  chapters: [chapterSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

