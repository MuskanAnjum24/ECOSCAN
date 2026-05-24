const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['earned', 'redeemed'], required: true },
  points:      { type: Number, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
