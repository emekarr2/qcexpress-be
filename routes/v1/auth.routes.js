const { Router } = require("express");
const AuthController = require("../../app/authentication/auth_controller");
const router = Router();

router.post("/resend-otp", AuthController.resendOtp);

router.post("/login", AuthController.loginUser);

router.post("/password-reset-link", AuthController.passwordResetLink);
router.post("/business-user/password-reset-link", AuthController.businessUserPasswordResetLink);

router.put("/reset-password", AuthController.resetPassword);
router.put("/business-user/reset-password", AuthController.resetBusinessUserPassword);

router.get("/generate-access", AuthController.generateAccessToken);


module.exports = router;
