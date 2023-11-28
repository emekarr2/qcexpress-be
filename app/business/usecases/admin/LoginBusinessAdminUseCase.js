const adminRepo = require("../../repository/buiness_admin_repo");
const hasher = require("../../../authentication/hasher");
const tokens = require("../../../authentication/tokens");
const CustomError = require("../../../../errors/error");

class LoginBusinessAdminUseCase {
  #adminRepo = adminRepo;

  #hasher = hasher;

  #tokens = tokens;

  async execute(data) {
    if (!data.email) throw new CustomError('pass in email', 400)
    if (!data.password) throw new CustomError('pass in a password', 400)
    const admin = await this.#adminRepo.findOneByFields({
      email: data.email,
    });
    this.#__rejectOnAdminDoesNotExist(admin);
    const success = await this.#hasher.verifyPassword(
      data.password,
      admin.password
    );
    if (!success) throw new CustomError("incorrect password", 403);
    const access_token = await this.#tokens.generateAccessToken(
      admin.email,
      admin.id,
      admin.org_name,
      admin.business
    );
    const refresh_tokens = await this.#tokens.generateRefreshToken(
      admin.email,
      admin.id,
      admin.business,
      admin.org_name
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

module.exports = Object.freeze(new LoginBusinessAdminUseCase());
