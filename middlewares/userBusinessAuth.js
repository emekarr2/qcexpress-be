const ServerResponse = require("../utils/response");
const token = require("../app/authentication/tokens");
const CustomError = require("../errors/error");
const buiness_repo = require("../app/business/repository/buiness_repo");
const { decrypt } = require("../utils/encrypter");

module.exports = (businessOnly) => async (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (typeof tokenHeader === "undefined")
      return ServerResponse.message("an auth token is required for this route")
        .success(false)
        .statusCode(403)
        .respond(res);
    const bearer = tokenHeader.split(" ")[1];
    // check to see if it is an apikey
    const clientID = req.headers.clientid;
    if (typeof clientID !== "undefined") {
      const business = await buiness_repo.findById(clientID);
      if (!business)
        return ServerResponse.message("invalid client id")
          .success(false)
          .statusCode(403)
          .respond(res);
      const tokenParts = bearer.split(":");
      let environment = "";
      let token = "";
      if (tokenParts[0] === "pt") {
        environment = "production";
        token = business.prod_api_key;
      } else if (tokenParts[0] === "st") {
        environment = "sandbox";
        token = business.staging_api_key;
      } else {
        return ServerResponse.message("invalid credentials")
          .success(false)
          .statusCode(403)
          .respond(res);
      }
      const plainKey = decrypt(token);
      if (plainKey !== tokenParts[1])
        return ServerResponse.message("invalid credentials")
          .success(false)
          .statusCode(403)
          .respond(res);
      req.reqState = {
        environment,
        name: business.org_name,
        email: business.email,
        website: business.phonenumber,
        phonenumber: business.phonenumber,
        id: business.id,
        channel: "api",
      };
    } else if (!businessOnly && !req.reqState) {
      const result = await token.verifyToken(bearer);
      if (result.type != token.TOKEN_TYPE.ACCESS_TOKEN)
        return ServerResponse.message("invalid access token used")
          .success(false)
          .statusCode(403)
          .respond(res);
      req.user = {};
      req.user.email = result.email;
      req.user.userId = result.userId;
      req.user.username = result.username;
      req.user.firstname = result.firstname;
      req.user.lastname = result.lastname;
      req.user.verified_email = result.verified_email;
      req.user.verified_mobile = result.verified_mobile;
      req.user.channel = 'qc'
      req.user.environment = process.env.ENVIRONMENT
    }
    next();
  } catch (err) {
    next(new CustomError("access denied", 403));
  }
};
