const { Router } = require("express");

const user_routes = require("./user.routes");
const auth_routes = require("./auth.routes");
const booking_routes = require("./booking.routes");
const price_routes = require("./price.routes");
const tracking_routes = require("./tracking.routes");
const admin_routes = require("./admin.routes");

const router = Router();

router.use("/user", user_routes);

router.use("/auth", auth_routes);

router.use("/booking", booking_routes);

router.use("/price", price_routes);

router.use("/tracking", tracking_routes);

router.use("/admin", admin_routes);

module.exports = router;
