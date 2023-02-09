const CreateZoneRatesUseCase = require("../usecases/CreateZoneRatesUseCase");
const ServerResponse = require("../../../utils/response");

class ZoneRateController {
  async createZoneRate(req, res, next) {
    try {
      const payload = req.body;
      const result = await CreateZoneRatesUseCase.execute(payload);
      ServerResponse.message("zone rate created")
        .data(result)
        .statusCode(201)
        .success(true)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new ZoneRateController());
