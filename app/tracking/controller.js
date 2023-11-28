const DhlService = require("../../services/DhlService");
const ServerResponse = require("../../utils/response");

class TrackingController {
  async trackShipment(req, res, next) {
    try {
      const { id } = req.query;
      if (!id)
        return ServerResponse.message("id is a required query parameter")
          .success(false)
          .statusCode(400)
          .respond(res);
      const response = await DhlService.trackShipment(id);
      if (response === null) {
        return ServerResponse.message("no package found")
          .statusCode(404)
          .data(response)
          .respond(res);
      }
      ServerResponse.message("tracking data fetched")
        .statusCode(200)
        .data(response)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new TrackingController());
