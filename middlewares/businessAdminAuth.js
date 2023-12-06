const ServerResponse = require("../utils/response");
const token = require("../app/authentication/tokens");
const CustomError = require("../errors/error");
const admin_repo = require("../app/business/repository/buiness_admin_repo");

module.exports = (tier) => {
  return async (req, res, next) => {
    try {
      const tokenHeader = req.headers.authorization;
      if (typeof tokenHeader === "undefined")
        return ServerResponse.message(
          "an access token is required for this route"
        )
          .success(false)
          .statusCode(403)
          .respond(res);
      const bearer = tokenHeader.split(" ")[1];
      const result = await token.verifyToken(bearer);
      if (result.type != token.TOKEN_TYPE.ACCESS_TOKEN)
        return ServerResponse.message("invalid access token used")
          .success(false)
          .statusCode(403)
          .respond(res);
      const adminExists = await admin_repo.findById(result.userId);
      if (adminExists === 0)
        return ServerResponse.message("admin no longer exists")
          .success(false)
          .statusCode(403)
          .respond(res);
      if (adminExists.access_tier > tier) {
        return ServerResponse.message("you are not authorised to access this route")
          .success(false)
          .statusCode(403)
          .respond(res);
      }
      req.admin = {};
      req.admin.email = result.email;
      req.admin.id = result.userId;
      req.admin.name = result.username;
      req.admin.business = adminExists.business.toString();
      req.admin.org_name = adminExists.org_name;
      next();
    } catch (err) {
      console.log(err)
      next(new CustomError("access denied", 403));
    }
  };
};
