const { Router } = require("express");
const TrackingController = require("../../app/tracking/controller");
const auth_middleware = require("../../middlewares/userBusinessAuth");

const router = Router();

router.get("/single", auth_middleware(false), TrackingController.trackShipment);

module.exports = router;
