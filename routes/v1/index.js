const { Router } = require('express');

const user_routes = require('./user.routes');
const auth_routes = require('./auth.routes');

const router = Router();

router.use('/user', user_routes);

router.use('/auth', auth_routes);

module.exports = router;
