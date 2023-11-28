const { Router } = require("express");

const user_routes = require("./user.routes");
const auth_routes = require("./auth.routes");
const booking_routes = require("./booking.routes");
const price_routes = require("./price.routes");
const tracking_routes = require("./tracking.routes");
const admin_routes = require("./admin.routes");
const zonerates_routes = require("./zone_rate.routes");
const onboarding_request_routes = require("./onboarding.request.routes");
const business_admin_routes = require("./business_admin.routes");

const router = Router();

router.use("/user", user_routes);

router.use("/auth", auth_routes);

router.use("/booking", booking_routes);

router.use("/price", price_routes);

router.use("/tracking", tracking_routes);

router.use("/admin", admin_routes);

router.use("/zonerates", zonerates_routes);

router.use("/onboarding-requests", onboarding_request_routes);

router.use("/business_admin", business_admin_routes);

module.exports = router;
