const Repository = require('../../../repository/mongo');
const UserModel = require('../model/User');

class UserRepository extends Repository {
	constructor() {
		super(UserModel);
	}
}

module.exports = Object.freeze(new UserRepository());
