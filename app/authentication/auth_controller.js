// usecases
const GenerateOtpUseCase = require("./usecases/Otp/GenerateOtpUseCase");
const LoginUserUseCase = require("./usecases/Authentication/LoginUserUseCase");
const GeneratePasswordResetLinkUseCase = require("./usecases/Authentication/GeneratePasswordResetLinkUseCase");
const ResetPasswordUseCase = require("./usecases/Authentication/ResetPasswordUseCase");
const GenerateAccessTokenUseCase = require("./usecases/Authentication/GenerateAccessTokenUseCase");
const businessRepo = require("../business/repository/buiness_repo");

// utils
const ServerResponse = require("../../utils/response");

// services
const EmailService = require("../../services/EmailService");
const GenerateBusinessUserPasswordResetLinkUseCase = require("./usecases/Authentication/GenerateBusinessUserPasswordResetLinkUseCase");
const ResetBusinessUserPasswordUseCase = require("./usecases/Authentication/ResetBusinessUserPasswordUseCase");

class AuthController {
  async resendOtp(req, res, next) {
    try {
      const { email } = req.query;
      const code = await GenerateOtpUseCase.execute(email);
      await EmailService.sendNodemailer(email, "Verify OTP", {
        header: "Verify your account using this OTP",
        body: `Password Reset code\n
          ${code}`,
        "header-body": "",
      });
      ServerResponse.message("otp sent successfully")
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async loginUser(req, res, next) {
    try {
      const data = req.body;
      const tokens = await LoginUserUseCase.execute(data);
      ServerResponse.message("user logged in successfully")
        .data(tokens)
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async passwordResetLink(req, res, next) {
    try {
      const { email } = req.body;
      const link = await GeneratePasswordResetLinkUseCase.execute(email);
      await EmailService.sendNodemailer(email, "Reset Password", {
        header: "Verify your account using this OTP",
        name: payload.firstname,
        body: `Password Reset link\n
          ${link}`,
        "header-body": "",
      });
      ServerResponse.message("link sent successfully")
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
  async businessUserPasswordResetLink(req, res, next) {
    try {
      const { email } = req.body;
      const link = await GenerateBusinessUserPasswordResetLinkUseCase.execute(
        email
      );
      await EmailService.sendNodemailer(email, "Reset Password", {
        header: "Password Reset Link",
        name: "QC User",
        body: `A password reset link was request for your account. If you authorised this click the link below and change your password\n
        If you did not please contact support immediately.\n\n\n${link}`,
      });
      ServerResponse.message("link sent successfully")
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token } = req.query;
      if (!token)
        return ServerResponse.message("token is requred for this route")
          .success(false)
          .statusCode(400)
          .respond(res);
      await ResetPasswordUseCase.execute(token, req.body.password);
      ServerResponse.message("password reset successfully")
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async resetBusinessUserPassword(req, res, next) {
    try {
      const { token } = req.body;
      if (!token)
        return ServerResponse.message("token is requred for this route")
          .success(false)
          .statusCode(400)
          .respond(res);
      const email = await ResetBusinessUserPasswordUseCase.execute(
        token,
        req.body.password
      );
      await EmailService.sendNodemailer(email, "Password Updated", {
        header: "Your password has been successfully updated",
        name: "QC User",
        body: `This is to inform you that your account password has been changed.\nIf this was not you please contact support.`,
      });
      ServerResponse.message("password reset successfully")
        .statusCode(200)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }

  async generateAccessToken(req, res, next) {
    try {
      const tokenHeader = req.headers.authorization;
      if (typeof tokenHeader === "undefined")
        return ServerResponse.message(
          "an refresh token is required for this route"
        )
          .success(false)
          .statusCode(403)
          .respond(res);
      const refresh_token = tokenHeader.split(" ")[1];
      const access_token = await GenerateAccessTokenUseCase.execute(
        refresh_token
      );
      ServerResponse.message("token generated successfully")
        .data({ access_token })
        .statusCode(201)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new AuthController());
