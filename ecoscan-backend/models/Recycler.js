const mongoose = require('mongoose');

const recyclerSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  address: { type: String, required: true },
  city:    { type: String, required: true },
  phone:   { type: String, default: '' },
  lat:     { type: Number },
  lng:     { type: Number },
  types:   [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Recycler', recyclerSchema);
