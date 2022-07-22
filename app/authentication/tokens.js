const jwt = require('jsonwebtoken');

class AuthTokensManager {
	#jwt = jwt;
	TOKEN_TYPE = {
		REFRESH_TOKEN: 'REFRESH_TOKEN',
		ACCESS_TOKEN: 'ACCESS_TOKEN',
	};

	async generateAccessToken(
		email,
		userId,
		username,
		firstname,
		lastname,
		verified_email,
		verified_mobile,
	) {
		return this.generateTokens(
			{
				email,
				userId,
				username,
				firstname,
				lastname,
				verified_email,
				verified_mobile,
				type: this.TOKEN_TYPE.ACCESS_TOKEN,
			},
			60 * 10, // expires in 10 mins
		);
	}

	async generateRefreshToken(
		email,
		userId,
		username,
		firstname,
		lastname,
		verified_email,
		verified_mobile,
	) {
		return this.generateTokens(
			{
				email,
				userId,
				username,
				firstname,
				lastname,
				verified_email,
				verified_mobile,
				type: this.TOKEN_TYPE.REFRESH_TOKEN,
			},
			60 * 720 * 60, // expires in 30 days
		);
	}

	async generateTokens(
		{
			email,
			userId,
			username,
			firstname,
			lastname,
			verified_email,
			verified_mobile,
			type,
		},
		expiresIn,
	) {
		return this.#jwt.sign(
			{
				email,
				userId,
				username,
				firstname,
				lastname,
				verified_email,
				verified_mobile,
				type,
			},
			process.env.JWT_SECRET,
			{
				expiresIn,
			},
		);
	}

	async verifyToken(token) {
		return this.#jwt.verify(token, process.env.JWT_SECRET);
	}
}

module.exports = Object.freeze(new AuthTokensManager());
