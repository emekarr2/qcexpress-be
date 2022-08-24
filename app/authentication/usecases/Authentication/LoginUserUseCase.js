const userRepo = require('../../../user/repository/user_repo');
const hasher = require('../../hasher');
const tokens = require('../../tokens');
const CustomError = require('../../../../errors/error');

class LoginUserUseCase {
	#userRepo = userRepo;

	#hasher = hasher;

	#tokens = tokens;

	async execute(data) {
		const email_regex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
		const is_email = email_regex.test(data.account);
		let user;
		if (is_email) {
			user = await this.#userRepo.findOneByFields({ email: data.account });
			this.#__rejectOnUserDoesNotExist(user);
			if (!user.verified_email)
				throw new CustomError('verify email before you login', 400);
		} else if (/^\d+$/.test(data.account)) {
			user = await this.#userRepo.findOneByFields({
				phonenumber: data.account,
			});
			this.#__rejectOnUserDoesNotExist(user);
			if (!user.verified_mobile)
				throw new CustomError('verify your number before you login', 400);
		} else {
			user = await this.#userRepo.findOneByFields({ username: data.account });
			this.#__rejectOnUserDoesNotExist(user);
		}
		const success = await this.#hasher.verifyPassword(
			data.password,
			user.password,
		);
		if (!success) throw new CustomError('incorrect password', 403);
		const access_token = await this.#tokens.generateAccessToken(
			user.email,
			user._id,
			user.username,
			user.firstname,
			user.lastname,
			user.verified_email,
			user.verified_mobile,
		);
		const refresh_tokens = await this.#tokens.generateRefreshToken(
			user.email,
			user._id,
			user.username,
			user.firstname,
			user.lastname,
			user.verified_email,
			user.verified_mobile,
		);
		return {
			access_token,
			refresh_tokens,
		};
	}

	#__rejectOnUserDoesNotExist(user) {
		if (!user) throw new CustomError('user does not exist', 404);
	}
}

module.exports = Object.freeze(new LoginUserUseCase());
