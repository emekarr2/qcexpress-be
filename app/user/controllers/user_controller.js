const CreateUserUseCase = require('../usecases/CreateUserUseCase');
const ServerResponse = require('../../../utils/response');

class UserController {
	async createUser(req, res, next) {
		try {
			const data = req.body;
			await CreateUserUseCase.execute(data);
			ServerResponse.message('user created successfully').respond(res);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = Object.freeze(new UserController());
