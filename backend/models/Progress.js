const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapterId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  exercisesSolved: [{ type: String }]
}, { timestamps: true });

progressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);

