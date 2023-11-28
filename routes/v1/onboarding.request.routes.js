const { Router } = require("express");
const onboarding_request_controller = require("../../app/business/cotrollers/onboarding_request_controller");

const router = Router();

router.post("/create", onboarding_request_controller.sendOnboardingRequest);


module.exports = router;
