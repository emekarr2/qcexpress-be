const CreateOnboardingRequestUsecase = require("../usecases/onboarding_request/CreateOnboardingRequestUsecase");
const CreateOBusinessAdminUsecase = require("../usecases/admin/CreateBusinessAdminUseCase");
const ServerResponse = require("../../../utils/response");
const onboarding_request_repo = require("../repository/onboarding_request_repo");
const buiness_admin_repo = require("../repository/buiness_admin_repo");
const buiness_repo = require("../repository/buiness_repo");
const GenerateOtpUseCase = require("../../authentication/usecases/Otp/GenerateOtpUseCase");
const CustomError = require("../../../errors/error");
const { encrypt } = require("../../../utils/encrypter");
const crypto = require("crypto");
const EmailService = require("../../../services/EmailService");

class OnboardingRequestController {
  async sendOnboardingRequest(req, res, next) {
    try {
      const body = req.body;
      const request = await CreateOnboardingRequestUsecase.execute(body);
      await EmailService.sendNodemailer(
        "customercare@quartzclassic.com",
        "A new request for QCExpress API has been recorded",
        {
          header:
            `There has been a new request from ${body.company_name} to get access to the QCExpress Developer API`,
          name: request.firstname,
          body: "Visit the admin dashboard to review the details submited, access the companys contact information and also reject/accept the compants request.",
          "header-body": "",
        }
      );
      await EmailService.sendNodemailer(
        request.email,
        "Your request has been recieved",
        {
          header:
            "Your request to access QCExpress Developer API has been recieved",
          name: request.firstname,
          body: "The team is currently reviewing your request to get access to the Developer API.\n You will get a feedback from us shortly.",
          "header-body": "",
        }
      );
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
      await EmailService.sendNodemailer(
        request.email,
        "We have an update on your onboarding request",
        {
          header:
            "Your request to access QCExpress Developer API has been denied",
          name: request.firstname,
          body: `We are sorry to inform you that your request to access the QCExpress Developer API has been rejected.
        If you feel this is a mistake reach out to us on customercare@quartzclassic.com`,
          "header-body": "",
        }
      );
      ServerResponse.message("request rejected")
        .data(request)
        .statusCode(200)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async createBusinessUser(req, res, next) {
    try {
      const payload = req.body;
      const result = await CreateOBusinessAdminUsecase.execute({
        ...payload,
        access_tier: "2",
        business: req.admin.business,
        org_name: req.admin.org_name,
      });
      await EmailService.sendNodemailer(payload.email, "Welcome to QCExpress", {
        header: "You have been invited to the QCExpress Developer Dashboard",
        name: payload.firstname,
        body: `Your password to the dashboard is ${payload.password}.
            Use it to log into the Dashbaord and change them immediately.`,
        "header-body": "",
      });
      ServerResponse.message("admin created. send login details to admin")
        .data(result)
        .success(true)
        .statusCode(201)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async listBusinessUser(req, res, next) {
    try {
      const filter = {};
      if (req.query.tier) {
        filter.access_tier = req.query.tier;
      }
      const admins = await buiness_admin_repo.findManyByFields(
        {
          business: req.admin.business,
          ...filter,
        },
        {
          limit: req.query.limit,
          page: req.query.page,
        }
      );
      ServerResponse.message("success")
        .data(admins)
        .success(true)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const id = req.query.id;
      const deleted = await buiness_admin_repo.deleteById(id);
      if (!deleted) {
        return ServerResponse.message("user does not exist")
          .data(deleted)
          .success(true)
          .statusCode(404)
          .respond(res);
      }
      ServerResponse.message("deleted successfully")
        .data(deleted)
        .success(true)
        .statusCode(200)
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
      let password = await GenerateOtpUseCase.execute(request.email);
      const prod_api_key = crypto.randomBytes(32).toString("hex");
      const staging_api_key = crypto.randomBytes(32).toString("hex");
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
      await EmailService.sendNodemailer(
        request.email,
        "We have an update on your onboarding request",
        {
          header:
            "Your request to access QCExpress Developer API has been approved",
          name: request.firstname,
          body: `We are pleased to inform you that your request to access the QCExpress Developer API has been approved.
        \nYour password to the dashboard is ${password}.
        Use it to log into the Dashbaord and change them immediately.`,
          "header-body": "",
        }
      );
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
