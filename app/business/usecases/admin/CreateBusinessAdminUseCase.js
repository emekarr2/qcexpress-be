const CustomError = require("../../../../errors/error");
const { validateNewAdminPayload } = require("../../validators/admin_validator");
const adminRepo = require("../../repository/buiness_admin_repo");
const hasher = require("../../../authentication/hasher");

class CreateAdminUseCase {
  validateNewAdminPayload = validateNewAdminPayload;

  adminRepo = adminRepo;

  hasher = hasher;

  async execute(payload) {
    console.log('payload', payload)
    const result = this.validateNewAdminPayload(payload);
    if (result.error) throw new CustomError(result.error.message, 400);
    const adminExists = await this.adminRepo.count({
      email: result.value.email,
    });
    if (adminExists !== 0) throw new CustomError("email is already in use", 409);
    const superAdminExists = await this.adminRepo.count({
      access_tier: "1",
    });
    if (superAdminExists === 1 && payload.name === "superadmin") {
      throw new CustomError("only 1 access tier 1 admin can exist", 400);
    }
    const admin = await this.adminRepo.createEntry(result.value);
    if (admin == null) {
      throw new CustomError("could not create new admin", 500);
    }
    return admin;
  }
}

module.exports = Object.freeze(new CreateAdminUseCase());
