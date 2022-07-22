const tokens = require('../../tokens');
const CustomError = require('../../../../errors/error');

class GenerateAccessTokenUseCase {
	#token = tokens;

	async execute(token) {
		const result = await this.#token.verifyToken(token);
		if (result.type !== this.#token.TOKEN_TYPE.REFRESH_TOKEN)
			throw new CustomError('invalid token used', 403);
		return await this.#token.generateAccessToken(
			result.email,
			result.userId,
			result.username,
			result.firstname,
			result.lastname,
			result.verified_email,
			result.verified_mobile,
		);
	}
}

module.exports = Object.freeze(new GenerateAccessTokenUseCase());
