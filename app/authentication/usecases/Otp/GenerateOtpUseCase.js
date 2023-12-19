const generate_otp = require("../../../../utils/generate_otp");
const otpRepo = require("../../repository/otp_repo");
const hasher = require("../../hasher");

class GenerateOtpUseCase {
  #otpRepo = otpRepo;
  #generateOtp = generate_otp;
  #hasher = hasher;

  async execute(email) {
    const code = this.#generateOtp();
	console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV !== "production") {
      console.log(code);
    }
    console.log("code", code);
    await this.#otpRepo.upsert(
      { email },
      { email, code: await this.#hasher.hashPassword(code) }
    );
    return code;
  }
}

module.exports = Object.freeze(new GenerateOtpUseCase());
