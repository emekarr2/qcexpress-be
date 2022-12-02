const vat = require("../constants/vat");
const zone_rates = require("../constants/zone_rates");
const zones = require("../constants/zones");
const CustomError = require("../errors/error");
const RegionService = require("./RegionService");
const domesticZones = require("../constants/domestic_zones");

module.exports = async (
  amount,
  document,
  weight,
  destination,
  deliveryType,
  countyFrom,
  countyTo,
  cityFrom,
  cityTo
) => {
  if (destination === "NG" || deliveryType === "domestic") {
    console.log("the weight");
    console.log(weight);
    if (weight > 70 || weight < 0.5) {
      throw new CustomError(`unsupported weight size selected`, 401);
    }
    await RegionService.searchCities(countyFrom, cityFrom);
    await RegionService.searchCities(countyTo, cityTo);
    let markUpPerc;
    if (
      domesticZones[countyFrom] === domesticZones[countyTo] &&
      countyFrom.toLowerCase() != "lagos" &&
      countyTo.toLowerCase() != "lagos"
    ) {
      markUpPerc = 30;
    }
    if (
      countyFrom.toLowerCase() === "lagos" ||
      countyTo.toLowerCase() === "lagos"
    ) {
      markUpPerc = 30;
    }
    if (
      domesticZones[countyFrom] !== domesticZones[countyTo] &&
      countyFrom.toLowerCase() != "lagos" &&
      countyTo.toLowerCase() != "lagos"
    ) {
      markUpPerc = 25;
    }
    const markup = (markUpPerc * amount) / 100;
    const markupVat = (markup * vat) / 100;
    const price = amount + markupVat + markup;
    return price;
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
  const price = amount + markupVat + markup;
  return price;
};
