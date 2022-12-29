const DhlService = require("../../services/DhlService");
const ServerResponse = require("../../utils/response");
const TaxCal = require("../../services/TaxCal");
const CustomError = require("../../errors/error");

class PriceController {
  async fetchSingleItemPrice(req, res, next) {
    try {
      const document = req.body.document;
      if (document === "document" && req.body.weight > 2) throw new CustomError('documents cannot exceed 2kg', 400)
      if (document === "document" && req.body.deliveryType === "domestic") throw new CustomError('documents cannot be delivered domestically', 400)
      const deliveryType = req.body.deliveryType;
      delete req.body.document;
      delete req.body.deliveryType;
      const dhlPrice = await DhlService.fetchDomesticRate(req.body);
      const price = await TaxCal(
        dhlPrice.products[0].totalPrice[0].price,
        document,
        dhlPrice.products[0].weight.provided,
        req.body.customerDetails.receiverDetails.countryCode,
        deliveryType,
        req.body.customerDetails.shipperDetails.countyName,
        req.body.customerDetails.receiverDetails.countyName,
        req.body.customerDetails.shipperDetails.cityName,
        req.body.customerDetails.receiverDetails.cityName
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
