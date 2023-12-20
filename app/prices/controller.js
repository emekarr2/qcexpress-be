const ServerResponse = require("../../utils/response");
const GetPriceUseCase = require("./usecases/GetPriceUseCase");

class PriceController {
  async fetchSingleItemPrice(req, res, next) {
    try {
      const price = await GetPriceUseCase.execute(req.body);
      ServerResponse.message("prices fetched")
        .statusCode(200)
        .data(price)
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new PriceController());
