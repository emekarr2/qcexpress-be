const Repository = require('../../../repository/mongo');
const OtpModel = require('../models/Otp');

class OtpRepository extends Repository {
	constructor() {
		super(OtpModel);
	}
}

module.exports = Object.freeze(new OtpRepository());
