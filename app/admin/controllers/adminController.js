const CreateAdminUseCase = require("../usecases/CreateAdminUseCase");
const adminRepo = require("../repository/admin_repo");
const userRepo = require("../../user/repository/user_repo");
const bookingRepo = require("../../booking/repository/booking_repo");

// utils
const ServerResponse = require("../../../utils/response");
const LoginAdmindUseCase = require("../../authentication/usecases/Authentication/Admin/LoginAdmindUseCase");
const DeleteAdminUseCase = require("../usecases/DeleteAdminUseCase");
const Booking = require("../../booking/model/Booking");

class AdminController {
  async createAdmin(req, res, next) {
    try {
      const payload = req.body;
      const result = await CreateAdminUseCase.execute(payload);
      ServerResponse.message("admin created. send login details to admin")
        .data(result)
        .success(true)
        .statusCode(201)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchAdmins(req, res, next) {
    try {
      const admins = await adminRepo.findManyByFields(
        {},
        { page: req.query.page, limit: req.query.limit }
      );
      ServerResponse.message("admins fetched")
        .data(admins)
        .statusCode(200)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async loginAdmin(req, res, next) {
    try {
      const payload = req.body;
      const result = await LoginAdmindUseCase.execute(payload);
      ServerResponse.message("login successful")
        .data(result)
        .success(true)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async deleteAdmin(req, res, next) {
    try {
      const payload = req.body;
      const result = await DeleteAdminUseCase.execute(payload);
      ServerResponse.message("delete successful")
        .success(true)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchKPIs(req, res, next) {
    try {
      const [userCount, bookingCount, topBooking] = await Promise.all([
        userRepo.count({}),
        bookingRepo.count({}),
        Booking.find({}).limit(5).sort({ $natural: -1 }),
      ]);
      ServerResponse.message("kpis fetched")
        .data({ userCount, bookingCount, topBooking })
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new AdminController());
