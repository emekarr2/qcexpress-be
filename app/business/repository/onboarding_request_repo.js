const Repository = require('../../../repository/mongo');
const OnboardingRequestModel = require('../model/OnboardingRequest');

class OnbaordingRequestRepository extends Repository {
	constructor() {
		super(OnboardingRequestModel);
	}
}

module.exports = Object.freeze(new OnbaordingRequestRepository());
