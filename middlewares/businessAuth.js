const ServerResponse = require("../utils/response");
const CustomError = require("../errors/error");
const buiness_repo = require("../app/business/repository/buiness_repo");
const { decrypt } = require("../utils/encrypter");

module.exports = async (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (typeof tokenHeader === "undefined")
      return ServerResponse.message("an auth token is required for this route")
        .success(false)
        .statusCode(403)
        .respond(res);
    const clientToken = tokenHeader.split(" ")[1];
    // check to see if it is an apikey
    const clientID = req.headers.clientid;
    if (!clientID) {
      return ServerResponse.message("no client id detected")
        .success(false)
        .statusCode(403)
        .respond(res);
    }
    const business = await buiness_repo.findById(clientID);
    if (!business)
      return ServerResponse.message("invalid client id")
        .success(false)
        .statusCode(403)
        .respond(res);

    const tokenParts = clientToken.split(":");
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
      channel: "api",
    };
    next();
  } catch (err) {
    next(new CustomError("access denied", 403));
  }
};
