const CreateUserUseCase = require('../usecases/CreateUserUseCase');
const GenerateOtpUseCase = require('../../authentication/usecases/Otp/GenerateOtpUseCase');
const ServerResponse = require('../../../utils/response');
const EmailService = require('../../../services/EmailService');

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
				payload: { 'v:token': code.code },
			});
			ServerResponse.message('user created successfully').respond(res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = Object.freeze(new UserController());
