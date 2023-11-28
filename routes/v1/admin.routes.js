const { Router } = require("express");
const AdminController = require("../../app/admin/controllers/adminController");
const adminAuth = require("../../middlewares/adminAuth");
const OnboardingRequestController = require("../../app/business/cotrollers/onboarding_request_controller");

const router = Router();

router.post("/create", adminAuth(false), AdminController.createAdmin);

router.get("/", adminAuth(false), AdminController.fetchAdmins);

router.post("/login", AdminController.loginAdmin);

router.delete("/delete", adminAuth(true), AdminController.deleteAdmin);

router.get("/kpis", adminAuth(false), AdminController.fetchKPIs);

router.get("/users", adminAuth(false), AdminController.fetchUsers);

router.get("/bookings", adminAuth(false), AdminController.fetchBookings);

router.post(
  "/onboarding-requests/fetch",
  adminAuth(false),
  OnboardingRequestController.fetchOnboardingRequests
);

router.put(
  "/onboarding-requests/approve",
  adminAuth(false),
  OnboardingRequestController.approveOnboardingRequests
);

router.put(
  "/onboarding-requests/reject",
  adminAuth(false),
  OnboardingRequestController.rejectOnboardingRequests
);

router.get(
  "/bookings/status",
  adminAuth(false),
  AdminController.fetchBookingsStatus
);

module.exports = router;
