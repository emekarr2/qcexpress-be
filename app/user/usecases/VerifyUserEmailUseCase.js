const userRepo = require('../repository/user_repo');
const VerifyOtpUseCase = require('../../authentication/usecases/Otp/VerifyOtpUseCase');

class VerifyUserEmailUseCase {
	#VerifyOtpUseCase = VerifyOtpUseCase;
	#userRepo = userRepo;

    async execute(data) {
		await this.#VerifyOtpUseCase.execute(data);
		await this.#userRepo.updateByFields(
			{ email: data.email },
			{
				verified_email: true,
			},
		);
	}
}

module.exports = Object.freeze(new VerifyUserEmailUseCase());
