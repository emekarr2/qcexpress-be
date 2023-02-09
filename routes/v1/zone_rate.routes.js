const { Router } = require("express");
const adminAuth = require("../../middlewares/adminAuth");
const ZoneRateController = require("../../app/prices/controllers/zoneRateController");

const router = Router();

router.post("/create", adminAuth(false), ZoneRateController.createZoneRate);

router.delete("/delete", adminAuth(false), ZoneRateController.deleteZoneRate);

router.put("/update", adminAuth(false), ZoneRateController.updateZoneRate);

router.get("/fetch", adminAuth(false), ZoneRateController.fetchZoneRate);

module.exports = router;
