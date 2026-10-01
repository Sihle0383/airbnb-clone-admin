const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

// POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const { accommodationId, checkIn, checkOut, guests } = req.body;
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) return res.status(404).json({ message: 'Accommodation not found' });

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      user: req.user.id,
      host: accommodation.host,
      checkIn, checkOut, guests,
      totalPrice: accommodation.price * guests // simple calc
    });
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/reservations/host
exports.getReservationsByHost = async (req, res) => {
  try {
    const reservations = await Reservation.find({ host: req.user.id }).populate('accommodation user');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reservations/user
exports.getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate('accommodation');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/reservations/:id
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Not found' });
    if (reservation.user.toString()!== req.user.id && reservation.host.toString()!== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await reservation.deleteOne();
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};