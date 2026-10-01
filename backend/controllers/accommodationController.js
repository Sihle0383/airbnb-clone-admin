const Accommodation = require('../models/Accommodation');

// POST /api/accommodations
exports.createAccommodation = async (req, res) => {
  try {
    const { title, description, location, price } = req.body;
    const accommodation = await Accommodation.create({
      title, description, location, price,
      host: req.user.id,
      images: req.files? req.files.map(f => f.path) : []
    });
    res.status(201).json(accommodation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/accommodations
exports.getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate('host', 'name email');
    res.json(accommodations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/accommodations/:id
exports.deleteAccommodation = async (req, res) => {
  try {
    const acc = await Accommodation.findById(req.params.id);
    if (!acc) return res.status(404).json({ message: 'Not found' });
    if (acc.host.toString()!== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await acc.deleteOne();
    res.json({ message: 'Accommodation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};