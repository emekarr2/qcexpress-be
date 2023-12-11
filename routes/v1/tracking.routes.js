const { Router } = require("express");
const TrackingController = require("../../app/tracking/controller");
const auth_middleware = require("../../middlewares/userBusinessAuth");
const business_admin_auth_middleware = require("../../middlewares/businessAdminAuth");

const router = Router();

router.get("/single", auth_middleware(false), TrackingController.trackShipment);

router.get(
  "/single/dashboard",
  business_admin_auth_middleware("2"),
  TrackingController.trackShipment
);

module.exports = router;
