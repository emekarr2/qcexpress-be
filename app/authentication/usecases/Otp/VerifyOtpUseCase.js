const otpRepo = require('../../repository/otp_repo');
const hasher = require('../../hasher');
const CustomError = require('../../../../errors/error');

class VerifyOtpUseCase {
	#otpRepo = otpRepo;
	#hasher = hasher;

	async execute({ email, code }) {
		const otp = await this.#otpRepo.findOneByFields({ email });
		if (!otp) throw new CustomError('otp does not exist', 404);
		const valid = await this.#hasher.verifyPassword(code, otp.code);
		if (!valid) throw new CustomError('invalid otp used', 400);
		await this.#otpRepo.deleteById(otp.id);
	}
}

module.exports = Object.freeze(new VerifyOtpUseCase());
