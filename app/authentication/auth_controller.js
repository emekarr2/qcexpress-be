const GenerateOtpUseCase = require('./usecases/Otp/GenerateOtpUseCase');
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
}

module.exports = Object.freeze(new AuthController());
