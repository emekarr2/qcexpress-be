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
      const deliveryType = req.body.deliveryType;
      delete req.body.document;
      delete req.body.deliveryType;
      let dhlPrice = null;
      if (document === "document") {
        dhlPrice = await DhlService.fetchDocumentRate({
          originCityName: req.body.customerDetails.shipperDetails.cityName,
          destinationCountryCode:
            req.body.customerDetails.receiverDetails.countryCode,
          originCountryCode:
            req.body.customerDetails.shipperDetails.countryCode,
          originPostalCode: req.body.customerDetails.shipperDetails.postalCode,
          destinationCityName:
            req.body.customerDetails.receiverDetails.cityName,
          destinationPostalCode:
            req.body.customerDetails.receiverDetails.cityName,
          weight: req.body.weight,
          length: req.body.length,
          width: req.body.width,
          height: req.body.height,
          isCustomsDeclarable: req.body.isCustomsDeclarable,
          plannedShippingDate: req.body.plannedShippingDateAndTime,
        });
      } else {
        dhlPrice = await DhlService.fetchNonDocumentRate({
          ...req.body,
          productCode: deliveryType === "domestic" ? "N" : "P",
        });
      }
      const price = await TaxCal(
        dhlPrice.products.totalPrice[0].price,
        document,
        dhlPrice.products.weight.provided,
        req.body.customerDetails.receiverDetails.countryCode,
        deliveryType,
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
