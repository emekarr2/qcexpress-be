const GenerateOtpUseCase = require('./usecases/Otp/GenerateOtpUseCase');
const LoginUserUseCase = require('./usecases/Authentication/LoginUserUseCase');
const GeneratePasswordResetLinkUseCase = require('./usecases/Authentication/GeneratePasswordResetLinkUseCase');
const ServerResponse = require('../../utils/response');
const EmailService = require('../../services/EmailService');

class AuthController {
	async resendOtp(req, res, next) {
		try {
			const { email } = req.query;
			const code = await GenerateOtpUseCase.execute(email);
			await EmailService.send({
				from: process.env.MAIL_SENDER_EMAIL,
				to: email,
				subject: 'Verify OTP',
				template: 'otp_verify',
				payload: { 'v:token': code },
			});
			ServerResponse.message('otp sent successfully').respond(res);
		} catch (err) {
			next(err);
		}
	}

	async loginUser(req, res, next) {
		try {
			const data = req.body;
			const tokens = await LoginUserUseCase.execute(data);
			ServerResponse.message('user logged in successfully')
				.data(tokens)
				.respond(res);
		} catch (err) {
			next(err);
		}
	}

	async passwordResetLink(req, res, next) {
		try {
			const { email } = req.body;
			const link = await GeneratePasswordResetLinkUseCase.execute(email);
			console.log(link);
			await EmailService.send({
				from: process.env.MAIL_SENDER_EMAIL,
				to: email,
				subject: 'Reset Password',
				template: 'forgot',
				payload: { 'v:token': link },
			});
			ServerResponse.message('link sent successfully').respond(res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = Object.freeze(new AuthController());
