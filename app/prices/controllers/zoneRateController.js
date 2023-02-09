const CreateZoneRatesUseCase = require("../usecases/CreateZoneRatesUseCase");
const ServerResponse = require("../../../utils/response");
const zone_rate_repo = require("../repository/zone_rate_repo");

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

  async deleteZoneRate(req, res, next) {
    try {
      const { id } = req.query;
      if (!id)
        ServerResponse.message("pass in zone rate id")
          .statusCode(400)
          .success(false)
          .respond(res);

      await zone_rate_repo.deleteById(id);
      ServerResponse.message("zone rate deleted").statusCode(200).respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new ZoneRateController());
