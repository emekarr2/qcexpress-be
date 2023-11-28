const CreateOnboardingRequestUsecase = require("../usecases/onboarding_request/CreateOnboardingRequestUsecase");
const ServerResponse = require("../../../utils/response");
const onboarding_request_repo = require("../repository/onboarding_request_repo");
const buiness_admin_repo = require("../repository/buiness_admin_repo");
const buiness_repo = require("../repository/buiness_repo");
const GenerateOtpUseCase = require("../../authentication/usecases/Otp/GenerateOtpUseCase");
const CustomError = require("../../../errors/error");
const { encrypt } = require("../../../utils/encrypter");
const crypto = require("crypto");

class OnboardingRequestController {
  async sendOnboardingRequest(req, res, next) {
    try {
      const body = req.body;
      const request = await CreateOnboardingRequestUsecase.execute(body);
      ServerResponse.message("onboarding request placed")
        .statusCode(201)
        .data(request)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async fetchOnboardingRequests(req, res, next) {
    try {
      const requests = await onboarding_request_repo.findManyByFields(
        req.body,
        {
          page: req.query.page,
          limit: req.query.limit,
        }
      );
      ServerResponse.message("admins fetched")
        .data(requests)
        .statusCode(200)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async rejectOnboardingRequests(req, res, next) {
    try {
      const request = await onboarding_request_repo.findById(req.query.id);
      if (!request) throw new CustomError("onboarding request not found", 404);
      if (request.status != "pending")
        throw new CustomError(
          `request has already been ${request.status}`,
          409
        );
      request.status = "rejected";
      await onboarding_request_repo.saveData(request);
      // send rejection email
      ServerResponse.message("request rejected")
        .data(request)
        .statusCode(200)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async approveOnboardingRequests(req, res, next) {
    try {
      const request = await onboarding_request_repo.findById(req.query.id);
      if (!request) throw new CustomError("onboarding request not found", 404);
      if (request.status != "pending")
        throw new CustomError(
          `request has already been ${request.status}`,
          409
        );
      request.status = "approved";
      await onboarding_request_repo.saveData(request);
      const password = await GenerateOtpUseCase.execute(request.email);
      const prod_api_key = crypto.randomBytes(32).toString("hex");
      const staging_api_key = crypto.randomBytes(32).toString("hex");
      console.log(staging_api_key);
      const business = await buiness_repo.createEntry({
        email: request.email,
        org_name: request.company_name,
        website: request.website,
        phonenumber: request.phonenumber,
        company_description: request.company_description,
        prod_api_key: encrypt(`${prod_api_key}`),
        staging_api_key: encrypt(`${staging_api_key}`),
      });
      await buiness_admin_repo.createEntry({
        firstname: request.firstname,
        lastname: request.lastname,
        email: request.email,
        org_name: request.company_name,
        access_tier: 1,
        business: business._id,
        password,
      });
      // send onboarding email
      ServerResponse.message("request approved")
        .data(request)
        .statusCode(200)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new OnboardingRequestController());
