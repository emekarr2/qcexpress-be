const { Router } = require("express");
const businessAdminAuth = require("../../middlewares/businessAdminAuth");
const adminAuth = require("../../middlewares/adminAuth");
const FeedBackController = require("../../app/feedback/controllers/feedback");

const router = Router();

router.post("/send", businessAdminAuth("2"), FeedBackController.sendFeedback);

router.delete("/delete", businessAdminAuth("2"), FeedBackController.deleteFeedback);

router.get("/fetch", businessAdminAuth("2"), FeedBackController.fetchFeedback);

router.post("/fetch/admin", adminAuth(false), FeedBackController.fetchFeedbackAdmin);

router.patch("/resolve", adminAuth(false), FeedBackController.resolveFeedbackAdmin);

module.exports = router;
