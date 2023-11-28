const ServerResponse = require('../utils/response');
const token = require('../app/authentication/tokens');
const CustomError = require('../errors/error');

module.exports = async (req, res, next) => {
	try {
		const tokenHeader = req.headers.authorization;
		if (typeof tokenHeader === 'undefined')
			return ServerResponse.message(
				'an access token is required for this route',
			)
				.success(false)
				.statusCode(403)
				.respond(res);
		const bearer = tokenHeader.split(' ')[1];
		const result = await token.verifyToken(bearer);
		if (result.type != token.TOKEN_TYPE.ACCESS_TOKEN)
			return ServerResponse.message('invalid access token used')
				.success(false)
				.statusCode(403)
				.respond(res);
		req.user = {};
		req.user.email = result.email;
		req.user.userId = result.userId;
		req.user.username = result.username;
		req.user.firstname = result.firstname;
		req.user.lastname = result.lastname;
		req.user.verified_email = result.verified_email;
		req.user.verified_mobile = result.verified_mobile;
		req.user.channel = "qc";
		next();
	} catch (err) {
		next(new CustomError('access denied', 403));
	}
};
