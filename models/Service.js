const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let serviceSchema = new Schema({
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Service", serviceSchema);
