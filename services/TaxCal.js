const vat = require("../constants/vat");
const zone_rates = require("../constants/zone_rates");
const zones = require("../constants/zones");
const CustomError = require("../errors/error");

module.exports = (amount, document, weight, destination, deliveryType) => {
  if (destination === "NG" || deliveryType === "domestic") {
    return amount;
  }
  const zone = zones.find(
    (z) =>
      z.Country.substring(
        z.Country.indexOf("(") + 1,
        z.Country.lastIndexOf(")")
      ) === destination
  );
  const charge = zone_rates[deliveryType][zone.Zone][document].find(
    (c) => weight >= c.min && weight <= c.max
  );
  if (!charge) throw new CustomError(`unsupported weight size selected`, 401);
  const markup = (charge.charge * amount) / 100;
  const markupVat = (markup * vat) / 100;
  const price = amount + markupVat;
  return price;
};
