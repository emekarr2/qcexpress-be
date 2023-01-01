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
  if (destination === "NG" && deliveryType === "domestic") {
    await RegionService.searchCities(countyFrom, cityFrom);
    await RegionService.searchCities(countyTo, cityTo);
    let markUpPerc;
    // zone D
    if (
      domesticZones[countyFrom.toLowerCase()] !==
        domesticZones[countyTo.toLowerCase()] &&
      countyFrom.toLowerCase() != "lagos" &&
      countyTo.toLowerCase() != "lagos"
    ) {
      const charge = zone_rates[deliveryType]["zoneD"][document].find(
        (c) => weight >= c.min && weight <= c.max
      );
      markUpPerc = charge.charge;
    } else if (countyFrom.toLowerCase() === countyTo.toLowerCase()) {
      // zone A
      const charge = zone_rates[deliveryType]["zoneA"][document].find(
        (c) => weight >= c.min && weight <= c.max
      );
      markUpPerc = charge.charge;
    } else if (
      domesticZones[countyFrom.toLowerCase()] ===
      domesticZones[countyTo.toLowerCase()]
    ) {
      // zone B
      const charge = zone_rates[deliveryType]["zoneB"][document].find(
        (c) => weight >= c.min && weight <= c.max
      );
      markUpPerc = charge.charge;
      console.log(markUpPerc);
    } else if (
      (countyFrom.toLowerCase() === "lagos" &&
        domesticZones[countyTo] !== "south_west") ||
      (countyTo.toLowerCase() === "lagos" &&
        domesticZones[countyFrom] !== "south_west")
    ) {
      // zone C
      const charge = zone_rates[deliveryType]["zoneC"][document].find(
        (c) => weight >= c.min && weight <= c.max
      );
      markUpPerc = charge.charge;
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
