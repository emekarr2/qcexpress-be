const { Router } = require("express");
const AdminController = require("../../app/admin/controllers/adminController");
const adminAuth = require("../../middlewares/adminAuth");

const router = Router();

router.post("/create", adminAuth, AdminController.createAdmin);

module.exports = router;
