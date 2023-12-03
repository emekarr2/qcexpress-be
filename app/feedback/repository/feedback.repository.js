const Repository = require("../../../repository/mongo");
const FeedbackModel = require("../models/feedback");

class FeedBackRepository extends Repository {
  constructor() {
    super(FeedbackModel);
  }
}

module.exports = Object.freeze(new FeedBackRepository());
