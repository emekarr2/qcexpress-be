const CustomError = require("../../../errors/error");
const { validateNewAdminPayload } = require("../validators/admin.Js");
const adminRepo = require("../repository/admin_repo");
const hasher = require("../../authentication//hasher");

class CreateAdminUseCase {
  validateNewAdminPayload = validateNewAdminPayload;

  adminRepo = adminRepo;

  hasher = hasher;

  async execute(payload) {
    const result = this.validateNewAdminPayload(payload);
    if (result.error) throw new CustomError(result.error.message, 400);
    const adminExists = await this.adminRepo.count({
      email: result.value.email,
    });
    if (adminExists !== 0) throw new CustomError("email is already in use", 409);
    const superAdminExists = await this.adminRepo.count({
      name: "superadmin",
    });
    if (superAdminExists === 1 && payload.name === "superadmin") {
      throw new CustomError("name cannot be superadmin", 409);
    }
    const admin = await this.adminRepo.createEntry(result.value);
    if (admin == null) {
      throw new CustomError("could not create new admin", 500);
    }
    return admin;
  }
}

module.exports = Object.freeze(new CreateAdminUseCase());
