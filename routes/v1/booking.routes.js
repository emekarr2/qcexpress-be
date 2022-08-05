const { Router } = require('express');
const auth_middleware = require('../../middlewares/auth');
const BookingController = require('../../app/booking/controllers/booking_controller');

const router = Router();

router.post('/create', auth_middleware, BookingController.createBooking);

module.exports = router;
