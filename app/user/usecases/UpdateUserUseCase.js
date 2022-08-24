const validateUser = require('../validators/user_validators');
const userRepo = require('../repository/user_repo');
const CustomError = require('../../../errors/error');

class UpdateUserUseCase {
	#validateUser = validateUser;
	#userRepo = userRepo;

	async execute(id, data) {
		const result = this.#validateUser.validateUpdateUser(data);
		if (result.error) throw new CustomError(result.error.message, 400);
		const updated = await this.#userRepo.updateById(id, result.value);
		if (!updated) throw new CustomError('user not updated', 400);
		return updated;
	}
}

module.exports = Object.freeze(new UpdateUserUseCase());
