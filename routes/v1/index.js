const { Router } = require('express');

const user_routes = require('./user.routes');

const router = Router();

router.use('/user', user_routes);

module.exports = router;
