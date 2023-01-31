const CustomError = require("../../../errors/error");
const { validateNewAdminPayload } = require("../validators/admin");
const adminRepo = require("../repository/admin_repo");
const hasher = require("../../authentication//hasher");

export class CreateAdminUseCase {
  validateNewAdminPayload = validateNewAdminPayload;

  adminRepo = adminRepo;

  hasher = hasher;

  async execute(payload) {
    const result = this.validateNewAdminPayload(payload);
    if (result.error) throw new CustomError(result.error.message, 400);
    const adminExists = await this.adminRepo.countDocs({
      email: result.value.email,
    });
    if (adminExists != 0) throw new CustomError("email is already in use", 409);
    result.value.password = await this.hasher.hashPassword(
      result.value.password
    );
    const admin = await this.adminRepo.createEntry(result.value);
    if (admin == null) {
      throw new CustomError("could not create new admin", 500);
    }
    return admin;
  }
}

module.exports = Object.freeze(new CreateAdminUseCase());
