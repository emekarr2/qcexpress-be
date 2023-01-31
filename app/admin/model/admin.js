const { model, Schema, Types } = require("mongoose");
const hasher = require("../../authentication/hasher");

let AdminSchema = new Schema(
  {
    name: {
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
    password: { type: String, required: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hasher.hashPassword(this.password);
  }
  next();
});

AdminSchema.method("toJSON", function () {
  const admin = this.toObject();
  delete admin.__v;
  delete admin.password;
  return admin;
});

module.exports = model("Admin", AdminSchema);
