const { model, Schema, Types } = require("mongoose");

let ZoneRateSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    document: { type: Boolean, required: true },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    charge: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

ZoneRateSchema.method("toJSON", function () {
  const zr = this.toObject();
  delete zr.__v;
  return zr;
});

module.exports = model("ZoneRate", ZoneRateSchema);
