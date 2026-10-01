const express = require('express');
const router = express.Router();
const { createAccommodation, getAllAccommodations, deleteAccommodation } = require('../controllers/accommodationController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllAccommodations);
router.post('/', auth, upload.array('images', 5), createAccommodation);
router.delete('/:id', auth, deleteAccommodation);

module.exports = router;