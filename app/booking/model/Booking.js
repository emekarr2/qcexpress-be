const { model, Schema, Types } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

let BookingSchema = new Schema(
  {
    customerId: {
      type: Types.ObjectId,
      required: true,
      index: true,
    },
    // category: {
    //   type: String,
    //   required: true,
    // },
    channel: {
      type: String,
    },
    declaredValue: {
      type: Number,
    },
    environment: {
      type: String,
    },
    document: {
      type: String,
      enum: ["document", "non_document"],
    },
    packages: [
      {
        description: String,
        weight: {
          type: Number,
          required: true,
        },
        dimensions: {
          length: {
            type: Number,
            required: true,
          },
          width: {
            type: Number,
            required: true,
          },
          height: {
            type: Number,
            required: true,
          },
        },
      },
    ],
    description: {
      type: String,
    },
    number_items: {
      type: Number,
      required: true,
    },
    declaredValue: {
      type: Number,
    },
    delivery_info: [
      {
        type: {
          type: String,
          required: true,
        },
        postalAddress: {
          postalCode: String,
          cityName: { type: String, required: true },
          countryCode: {
            type: String,
            required: true,
          },
          addressLine1: { type: String, required: true },
          countyName: String,
        },
        contactInformation: {
          phone: { type: String, required: true },
          companyName: String,
          fullName: { type: String, required: true },
          email: String,
        },
      },
    ],
    shipmentMeta: {
      trackingId: {
        type: String,
        required: true,
      },
      trackingUrl: {
        type: String,
        required: true,
      },
      packages: [
        {
          referenceNumber: {
            type: Number,
            required: true,
          },
          trackingNumber: {
            type: String,
            required: true,
          },
          trackingUrl: {
            type: String,
            required: true,
          },
        },
      ],
      documents: [
        {
          imageFormat: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

BookingSchema.plugin(mongoosePaginate);

module.exports = model("Booking", BookingSchema);
