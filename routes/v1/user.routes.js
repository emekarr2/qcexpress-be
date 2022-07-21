const { Router } = require('express');
const user_controller = require('../../app/user/controllers/user_controller');

const router = Router();

router.post('/create', user_controller.createUser);

router.put('/verify-email', user_controller.verifyUserEmail);

module.exports = router;
