const { Router } = require("express");
const PriceController = require("../../app/prices/controller");
const auth_middleware = require("../../middlewares/userBusinessAuth");

const router = Router();

router.post(
  "/single",
  auth_middleware(true),
  PriceController.fetchSingleItemPrice
);

module.exports = router;
