const validateUser = require('../validators/user_validators');
const userRepo = require('../repository/user_repo');
const CustomError = require('../../../errors/error');

class CreateUserUseCase {
	#validateUser = validateUser;
	#userRepo = userRepo;

	async execute(data) {
		const referral = data.username + Math.random().toString(36).substring(2, 7);
		data.referral = referral.toUpperCase();
		const result = this.#validateUser.validateNewUser(data);
		if (result.error) throw new CustomError(result.error.message, 400);
		const userExistsEmail = await this.#userRepo.count({
			email: result.value.email,
		});
		if (userExistsEmail != 0)
			throw new CustomError('user with email already exists', 409);
		const userExistsUsername = await this.#userRepo.count({
			username: result.value.username,
		});
		if (userExistsUsername != 0)
			throw new CustomError('user with username already exists', 409);
		const userExistsMobile = await this.#userRepo.count({
			phonenumber: result.value.phonenumber,
		});
		if (userExistsMobile != 0)
			throw new CustomError('user with number already exists', 409);
		await this.#userRepo.createEntry(result.value);
	}
}

module.exports = Object.freeze(new CreateUserUseCase());
