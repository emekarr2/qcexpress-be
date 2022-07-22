const { Router } = require('express');
const auth_middleware = require('../../middlewares/auth');
const user_controller = require('../../app/user/controllers/user_controller');

const router = Router();

router.post('/create', user_controller.createUser);

router.put('/verify-email', user_controller.verifyUserEmail);

router.delete('/delete', auth_middleware, user_controller.deleteUser);

router.get('/profile', auth_middleware, user_controller.getUserProfile);

router.put('/profile/update', auth_middleware, user_controller.updateUser);

module.exports = router;
