const { Router } = require("express");
const AdminController = require("../../app/admin/controllers/adminController");
const adminAuth = require("../../middlewares/adminAuth");

const router = Router();

router.post("/create", adminAuth(false), AdminController.createAdmin);

router.get("/login", AdminController.loginAdmin);

router.delete("/delete", adminAuth(true), AdminController.deleteAdmin);

module.exports = router;
