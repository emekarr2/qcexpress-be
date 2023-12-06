const DhlService = require("../../services/DhlService");
const ServerResponse = require("../../utils/response");
const TaxCal = require("../../services/TaxCal");
const CustomError = require("../../errors/error");
const { body } = require("express-validator");

class PriceController {
  async fetchSingleItemPrice(req, res, next) {
    try {
      const document = req.body.document;
      if (document === "document" && req.body.weight > 2)
        throw new CustomError("documents cannot exceed 2kg", 400);
      if (document === "document" && req.body.deliveryType === "domestic")
        throw new CustomError(
          "documents cannot be delivered domestically",
          400
        );
      let dhlPrice = null;
      dhlPrice = await DhlService.fetchRates({
        ...req.body,
        productCode:
          req.body.deliveryType === "domestic"
            ? "N"
            : req.body.document === "document"
            ? "D"
            : "P",
      });

      const price = await TaxCal(
        dhlPrice.products.totalPrice[0].price,
        document,
        dhlPrice.products.weight.provided,
        req.body.customerDetails.receiverDetails.countryCode,
        req.body.deliveryType,
        req.body.customerDetails.shipperDetails.countyName,
        req.body.customerDetails.receiverDetails.countyName,
        req.body.customerDetails.shipperDetails.cityName,
        req.body.customerDetails.receiverDetails.cityName
      );
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
