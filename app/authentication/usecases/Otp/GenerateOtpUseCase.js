const generate_otp = require('../../../../utils/generate_otp');
const otpRepo = require('../../repository/otp_repo');

class GenerateOtpUseCase {
	#otpRepo = otpRepo;
	#generateOtp = generate_otp;

	async execute(email) {
		return this.#otpRepo.createEntry({ email, code: this.#generateOtp() });
	}
}

module.exports = Object.freeze(new GenerateOtpUseCase());
