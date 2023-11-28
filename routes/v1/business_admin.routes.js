const { Router } = require("express");
const business_admin_controller = require("../../app/business/cotrollers/busiess_admin_controller");
const business_admin = require("../../middlewares/businessAdminAuth");

const router = Router();

router.post("/login", business_admin_controller.loginBusinessAdmin);

router.get(
  "/tokens/expose",
  business_admin(),
  business_admin_controller.exposeAPIKeys
);

router.get(
  "/kpis",
  business_admin(),
  business_admin_controller.fetchKPIs
);

module.exports = router;
