const tokens = require("../../tokens");
const hasher = require("../../hasher");
const CustomError = require("../../../../errors/error");
const validateUser = require("../../../user/validators/user_validators");
const userRepo = require("../../../business/repository/buiness_admin_repo");

class ResetPasswordUseCase {
  #tokens = tokens;

  #hasher = hasher;

  #validateUser = validateUser;

  #userRepo = userRepo;

  async execute(token, password) {
    const payload = await this.#tokens.verifyToken(token);
    const result = this.#validateUser.validateUpdateUser({ password });
    if (result.error) throw new CustomError(result.error.message, 400);
    await this.#userRepo.updateByFields(
      { email: payload.email },
      { password: await this.#hasher.hashPassword(password) }
    );
    return payload.email;
  }
}

module.exports = Object.freeze(new ResetPasswordUseCase());
