const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Accommodation', accommodationSchema);