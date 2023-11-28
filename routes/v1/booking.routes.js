const { Router } = require("express");
const userBusinessAuth = require("../../middlewares/userBusinessAuth");
const BookingController = require("../../app/booking/controllers/booking_controller");

const router = Router();

router.post(
  "/create",
  userBusinessAuth(false),
  BookingController.createBooking
);

router.get("/download-docs", BookingController.downloadDocs);

module.exports = router;
