const {
  validateOnboardingRequest,
} = require("../../validators/onboarding_request");
const onboardingRequestRepo = require("../../repository/onboarding_request_repo");
const CustomError = require("../../../../errors/error");

class CreateOnboardingRequest {
  #validator = validateOnboardingRequest;
  #onboardingRequestRepo = onboardingRequestRepo;

  async execute(data) {
    const result = this.#validator(data);
    if (result.error) throw new CustomError(result.error.message, 400);
    const request_exits = await this.#onboardingRequestRepo.count({
      email: result.value.email,
    });
    if (request_exits != 0)
      throw new CustomError("onboarding request already exists", 409);
    result.value.status = "pending";
    const request = await this.#onboardingRequestRepo.createEntry(result.value);
    return request;
  }
}

module.exports = Object.freeze(new CreateOnboardingRequest());
