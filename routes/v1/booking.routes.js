const { Router } = require("express");
const businessAdminAuth = require("../../middlewares/businessAdminAuth");
const userBusinessAuth = require("../../middlewares/userBusinessAuth");
const BookingController = require("../../app/booking/controllers/booking_controller");

const router = Router();

router.post(
  "/create",
  userBusinessAuth(false),
  BookingController.createBooking
);

router.get(
  "/download-docs",
  businessAdminAuth(false),
  BookingController.downloadDocs
);

router.post(
  "/developer/booking",
  businessAdminAuth(false),
  BookingController.fetchDeveloperDashBoardBookings
);
module.exports = router;
