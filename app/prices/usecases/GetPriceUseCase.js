const DhlService = require("../../../services/DhlService");
const TaxCal = require("../../../services/TaxCal");
const CustomError = require("../../../errors/error");

class GetPriceUseCase {
  async execute(body) {
    const document = body.document;
    if (document === "document" && body.weight > 2)
      throw new CustomError("documents cannot exceed 2kg", 400);
    if (document === "document" && body.deliveryType === "domestic")
      throw new CustomError("documents cannot be delivered domestically", 400);
    let dhlPrice = null;
    dhlPrice = await DhlService.fetchRates({
      ...body,
      productCode:
        body.deliveryType === "domestic"
          ? "N"
          : body.document === "document"
          ? "D"
          : "P",
    });

    const price = await TaxCal(
      dhlPrice.products.totalPrice[0].price,
      document,
      dhlPrice.products.weight.provided,
      body.customerDetails.receiverDetails.countryCode,
      body.deliveryType,
      body.customerDetails.shipperDetails.countyName,
      body.customerDetails.receiverDetails.countyName,
      body.customerDetails.shipperDetails.cityName,
      body.customerDetails.receiverDetails.cityName
    );
    return price
  }
}

module.exports = new GetPriceUseCase();
