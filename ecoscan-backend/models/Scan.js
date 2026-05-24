const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName:     { type: String, required: true },
  material:     { type: String, default: 'Unknown' },
  recyclable:   { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 },
  imageUrl:     { type: String, default: '' },
  aiResponse:   { type: String, default: '' },
  recycled:     { type: Boolean, default: false },
  recycledAt:   { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
