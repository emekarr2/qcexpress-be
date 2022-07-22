// usecases
const CreateUserUseCase = require('../usecases/CreateUserUseCase');
const VerifyUserUseCase = require('../usecases/VerifyUserEmailUseCase');
const GenerateOtpUseCase = require('../../authentication/usecases/Otp/GenerateOtpUseCase');

// utils
const ServerResponse = require('../../../utils/response');

// services
const EmailService = require('../../../services/EmailService');

// repos
const user_repo = require('../repository/user_repo');

class UserController {
	async createUser(req, res, next) {
		try {
			const data = req.body;
			await CreateUserUseCase.execute(data);
			const code = await GenerateOtpUseCase.execute(data.email);

			await EmailService.send({
				from: process.env.MAIL_SENDER_EMAIL,
				to: data.email,
				subject: 'Verify OTP',
				template: 'otp_verify',
				payload: { 'v:token': code },
			});
			ServerResponse.message('user created successfully').respond(res);
		} catch (err) {
			next(err);
		}
	}

	async verifyUserEmail(req, res, next) {
		try {
			const data = req.body;
			await VerifyUserUseCase.execute(data);
			ServerResponse.message('email verified successfully').respond(res);
		} catch (err) {
			next(err);
		}
	}

	async deleteUser(req, res, next) {
		try {
			const deleted = await user_repo.deleteById(req.user.userId);
			if (!deleted)
				return ServerResponse.message('user does not exist')
					.success(false)
					.statusCode(404)
					.respond(res);
			ServerResponse.message('user deleted successfully').respond(res);
		} catch (err) {
			next(err);
		}
	}

	async getUserProfile(req, res, next) {
		try {
			const user = await user_repo.findById(req.user.userId);
			ServerResponse.message('profile fetched').data(user).respond(res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = Object.freeze(new UserController());
