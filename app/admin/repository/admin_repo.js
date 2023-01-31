const Repository = require("../../../repository/mongo");
const AdminModel = require("../model/admin");

class AdminRepository extends Repository {
  constructor() {
    super(AdminModel);
  }
}

module.exports = Object.freeze(new AdminRepository());
