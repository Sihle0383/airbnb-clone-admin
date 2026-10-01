const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createReservation, getReservationsByHost, getReservationsByUser, deleteReservation } = require('../controllers/reservationController');

router.post('/', auth, createReservation);
router.get('/host', auth, getReservationsByHost);
router.get('/user', auth, getReservationsByUser);
router.delete('/:id', auth, deleteReservation);

module.exports = router;