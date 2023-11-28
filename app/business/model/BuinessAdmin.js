const { model, Schema, Types } = require("mongoose");
const hasher = require("../../authentication/hasher");
const mongoosePaginate = require("mongoose-paginate-v2");

let BusinessAdminSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
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
    access_tier: {
      type: String,
      trim: true,
      required: true,
    },
    password: { type: String, required: true },
    business: {
      type: Types.ObjectId,
      ref: "OnboardingRequest",
      required: true,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

BusinessAdminSchema.plugin(mongoosePaginate);

BusinessAdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hasher.hashPassword(this.password);
  }
  next();
});

BusinessAdminSchema.method("toJSON", function () {
  const admin = this.toObject();
  delete admin.__v;
  delete admin.password;
  return admin;
});

module.exports = model("BusinessAdmin", BusinessAdminSchema);
