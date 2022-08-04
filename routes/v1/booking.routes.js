const { Router } = require('express');
const BookingController = require('../../app/booking/controllers/booking_controller');

const router = Router();

router.post('/create', BookingController.createBooking);

module.exports = router;
