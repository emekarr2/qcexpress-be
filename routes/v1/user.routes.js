const { Router } = require('express');
const user_controller = require('../../app/user/controllers/user_controller');

const router = Router();

router.post('/create', user_controller.createUser);

module.exports = router;
