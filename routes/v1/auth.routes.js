const { Router } = require('express');
const AuthController = require('../../app/authentication/auth_controller');
const router = Router();

router.post('/resend-otp', AuthController.resendOtp);

router.post('/login', AuthController.loginUser);

module.exports = router;
