const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OnboardingRequestSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      default: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
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
    company_name: {
      type: String,
      required: true,
    },
    intent: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

OnboardingRequestSchema.plugin(mongoosePaginate);

OnboardingRequestSchema.method("toJSON", function () {
  const user = this.toObject();
  delete user.__v;
  delete user.password;
  return user;
});

module.exports = model("OnboardingRequest", OnboardingRequestSchema);
