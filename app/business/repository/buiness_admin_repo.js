const Repository = require("../../../repository/mongo");
const BusinessAdminModel = require("../model/BuinessAdmin");

class BusinessAdmintRepository extends Repository {
  constructor() {
    super(BusinessAdminModel);
  }
}

module.exports = Object.freeze(new BusinessAdmintRepository());
