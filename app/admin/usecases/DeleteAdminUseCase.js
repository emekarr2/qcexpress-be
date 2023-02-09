const CustomError = require("../../../errors/error");
const adminRepo = require("../repository/admin_repo");

class DelereAdminUseCase {
  adminRepo = adminRepo;

  async execute(payload) {
    const admin = await this.adminRepo.findById(payload.id);
    if (!admin) throw new CustomError("admin does not exist", 404);
    if (admin.name === "superadmin") {
      throw new CustomError("the superadmin cannot be deleted", 401);
    }
    await this.adminRepo.deleteById(payload.id);
    return admin;
  }
}

module.exports = Object.freeze(new DelereAdminUseCase());
