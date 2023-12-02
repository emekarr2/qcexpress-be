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
  businessAdminAuth("2"),
  BookingController.downloadDocs
);

router.post(
  "/developer/booking",
  businessAdminAuth("2"),
  BookingController.fetchDeveloperDashBoardBookings
);
module.exports = router;
