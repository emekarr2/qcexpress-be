const CreateAdminUseCase = require("../usecases/CreateAdminUseCase");
const adminRepo = require("../repository/admin_repo");

// utils
const ServerResponse = require("../../../utils/response");
const LoginAdmindUseCase = require("../../authentication/usecases/Authentication/Admin/LoginAdmindUseCase");
const DeleteAdminUseCase = require("../usecases/DeleteAdminUseCase");

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
      const admins = await adminRepo.findAll();
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
}

module.exports = Object.freeze(new AdminController());
