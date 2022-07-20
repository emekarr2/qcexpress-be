const jwt = require('jsonwebtoken');

class AuthTokensManager {
	#jwt = jwt;
	TOKEN_TYPE = {
		REFRESH_TOKEN: 'REFRESH_TOKEN',
		ACCESS_TOKEN: 'ACCESS_TOKEN',
	};

	async generateAccessToken(email, userId, username, firstname, lastname) {
		return this.#__generateTokens(
			email,
			userId,
			username,
			firstname,
			lastname,
			this.TOKEN_TYPE.ACCESS_TOKEN,
			60 * 10, // expires in 10 mins
		);
	}

	async generateRefreshToken() {
		return this.#__generateTokens(
			email,
			userId,
			username,
			firstname,
			lastname,
			this.TOKEN_TYPE.REFRESH_TOKEN,
			60 * 720 * 60, // expires in 30 days
		);
	}

	async #__generateTokens(
		email,
		userId,
		username,
		firstname,
		lastname,
		type,
		expiresIn,
	) {
		return this.#jwt.sign(
			{
				email,
				userId,
				username,
				firstname,
				lastname,
				type,
			},
			process.env.JWT_SECRET,
			{
				expiresIn,
			},
		);
	}
}

module.exports = Object.freeze(new AuthTokensManager());
