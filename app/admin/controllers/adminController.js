const CreateAdminUseCase = require("../usecases/CreateAdminUseCase");

// utils
const ServerResponse = require("../../../utils/response");

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
}

module.exports = Object.freeze(new AdminController());
