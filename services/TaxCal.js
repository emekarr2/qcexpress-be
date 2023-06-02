const vat = require("../constants/vat");
const zones = require("../constants/zones");
const RegionService = require("./RegionService");
const domesticZones = require("../constants/domestic_zones");
const zonerateRepo = require("../app/prices/repository/zone_rate_repo");
const CustomError = require("../errors/error");

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
      markUpPerc = await fetchZoneRate(
        deliveryType,
        "zoneD",
        document === "document",
        weight
      );
    } else if (countyFrom.toLowerCase() === countyTo.toLowerCase()) {
      // zone A
      markUpPerc = await fetchZoneRate(
        deliveryType,
        "zoneA",
        document === "document",
        weight
      );
    } else if (
      domesticZones[countyFrom.toLowerCase()] ===
      domesticZones[countyTo.toLowerCase()]
    ) {
      // zone B
      markUpPerc = await fetchZoneRate(
        deliveryType,
        "zoneB",
        document === "document",
        weight
      );
    } else if (
      (countyFrom.toLowerCase() === "lagos" &&
        domesticZones[countyTo] !== "south_west") ||
      (countyTo.toLowerCase() === "lagos" &&
        domesticZones[countyFrom] !== "south_west")
    ) {
      // zone C
      markUpPerc = await fetchZoneRate(
        deliveryType,
        "zoneC",
        document === "document",
        weight
      );
    }
    const markup = (markUpPerc * amount.toFixed(2)) / 100;
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
  const markup =
    ((await fetchZoneRate(
      deliveryType,
      zone.Zone,
      document === "document",
      weight
    )) *
      amount.toFixed(2)) /
    100;
  const markupVat = (markup * vat) / 100;
  const price = amount + markupVat + markup;
  return price.toFixed(2);
};

const fetchZoneRate = async (type, zone, document, weight) => {
  const rate = await zonerateRepo.findOneByFields({
    type,
    zone,
    document,
    min: {
      $lte: weight,
    },
    max: {
      $gte: weight,
    },
  });
  if (!rate)
    throw new CustomError("zone rate does not exist for this weight", 400);
  return rate.charge;
};
