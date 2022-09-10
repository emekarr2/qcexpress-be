// usecases
const CreateUserUseCase = require('../usecases/CreateUserUseCase');
const VerifyUserUseCase = require('../usecases/VerifyUserEmailUseCase');
const GenerateOtpUseCase = require('../../authentication/usecases/Otp/GenerateOtpUseCase');
const UpdateUserUseCase = require('../usecases/UpdateUserUseCase');

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
			ServerResponse.message('user created successfully')
				.statusCode(201)
				.respond(res);
		} catch (err) {
			next(err);
		}
	}

	async verifyUserEmail(req, res, next) {
		try {
			const data = req.body;
			await VerifyUserUseCase.execute(data);
			ServerResponse.message('email verified successfully')
				.statusCode(200)
				.respond(res);
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
			ServerResponse.message('user deleted successfully')
				.statusCode(200)
				.respond(res);
		} catch (err) {
			next(err);
		}
	}

	async getUserProfile(req, res, next) {
		try {
			const user = await user_repo.findById(req.user.userId);
			if (!user)
				return ServerResponse.message('user does not exist')
					.statusCode(404)
					.success(false)
					.respond(res);
			ServerResponse.message('profile fetched')
				.statusCode(200)
				.data(user)
				.respond(res);
		} catch (err) {
			next(err);
		}
	}

	async updateUser(req, res, next) {
		try {
			const payload = req.body;
			if (!Object.keys(payload).length) {
				return ServerResponse.message('pass in data to be updated')
					.statusCode(400)
					.success(false)
					.respond(res);
			}
			if (payload.email || payload.phonenumber)
				return ServerResponse.message(
					'use a different route to update email or phone number',
				)
					.statusCode(400)
					.success(false)
					.respond(res);
			const updated = await UpdateUserUseCase.execute(req.user.userId, payload);
			ServerResponse.message('profile updated')
				.statusCode(200)
				.data(updated)
				.respond(res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = Object.freeze(new UserController());
