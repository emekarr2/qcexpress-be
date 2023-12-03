const { model, Schema, Types } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

let FeedbackSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    business: {
      type: Types.ObjectId,
      ref: "Business",
      required: true,
    },
    from: {
      type: Types.ObjectId,
      ref: "BusinessAdmin",
      required: true,
    },
    admin_name: {
      type: String,
      trim: true,
    },
    org_name: {
      type: String,
      trim: true,
      required: true,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

FeedbackSchema.plugin(mongoosePaginate);

FeedbackSchema.method("toJSON", function () {
  const feedback = this.toObject();
  delete feedback.__v;
  return feedback;
});

module.exports = model("FeedBack", FeedbackSchema);
