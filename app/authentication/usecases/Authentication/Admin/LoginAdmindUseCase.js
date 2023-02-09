const adminRepo = require("../../../../admin/repository/admin_repo");
const hasher = require("../../../hasher");
const tokens = require("../../../tokens");
const CustomError = require("../../../../../errors/error");

class LoginAdminUseCase {
  #adminRepo = adminRepo;

  #hasher = hasher;

  #tokens = tokens;

  async execute(data) {
    const admin = await this.#adminRepo.findOneByFields({
      email: data.account,
    });
    this.#__rejectOnAdminDoesNotExist(admin);
    const success = await this.#hasher.verifyPassword(
      data.password,
      admin.password,
    );
    if (!success) throw new CustomError("incorrect password", 403);
    const access_token = await this.#tokens.generateAccessToken(
      admin.email,
      admin.id,
      admin.name
    );
    const refresh_tokens = await this.#tokens.generateRefreshToken(
      admin.email,
      admin.id,
      admin.name
    );
    return {
      access_token,
      refresh_tokens,
      admin,
    };
  }

  #__rejectOnAdminDoesNotExist(admin) {
    if (!admin) throw new CustomError("admin does not exist", 404);
  }
}

module.exports = Object.freeze(new LoginAdminUseCase());
