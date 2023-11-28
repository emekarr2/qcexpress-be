const Repository = require("../../../repository/mongo");
const BusinessModel = require("../model/Buiness");

class BusinessRepository extends Repository {
  constructor() {
    super(BusinessModel);
  }
}

module.exports = Object.freeze(new BusinessRepository());
