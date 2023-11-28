const { model, Schema, Types } = require("mongoose");
const hasher = require("../../authentication/hasher");
const mongoosePaginate = require("mongoose-paginate-v2");

let BusinessSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    org_name: {
      type: String,
      trim: true,
      required: true,
    },
    prod_api_key: {
      type: String,
      trim: true,
      required: true,
    },
    staging_api_key: {
      type: String,
      trim: true,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
    },
    company_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

BusinessSchema.plugin(mongoosePaginate);

BusinessSchema.method("toJSON", function () {
  const admin = this.toObject();
  delete admin.__v;
  delete admin.password;
  return admin;
});

module.exports = model("Business", BusinessSchema);
