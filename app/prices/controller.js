const DhlService = require("../../services/DhlService");
const ServerResponse = require("../../utils/response");
const TaxCal = require("../../services/TaxCal");

class PriceController {
  async fetchSingleItemPrice(req, res, next) {
    try {
      const document = req.body.document;
      const deliveryType = req.body.deliveryType;
      delete req.body.document;
      delete req.body.deliveryType;
      const dhlPrice = await DhlService.fetchDomesticRate(req.body);
      const price = TaxCal(
        dhlPrice.products[0].totalPrice[0].price,
        document,
        req.body.weight,
        req.body.customerDetails.receiverDetails.countryCode,
        deliveryType
      );
      ServerResponse.message("prices fetched")
        .statusCode(200)
        .data(price.toFixed(2))
        .respond(res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Object.freeze(new PriceController());
