const Repository = require("../../../repository/mongo");
const ZoneRateModel = require("../models/ZoneRates");

class ZoneRateRepository extends Repository {
  constructor() {
    super(ZoneRateModel);
  }
}

module.exports = Object.freeze(new ZoneRateRepository());
