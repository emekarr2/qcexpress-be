const { Router } = require('express');

const user_routes = require('./user.routes');
const auth_routes = require('./auth.routes');
const booking_routes = require('./booking.routes');
const price_routes = require('./price.routes');

const router = Router();

router.use('/user', user_routes);

router.use('/auth', auth_routes);

router.use('/booking', booking_routes);

router.use('/price', price_routes);

module.exports = router;
