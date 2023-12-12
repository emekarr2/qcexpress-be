const joi = require("joi");

exports.validateBooking = (data) =>
  joi
    .object({
      customerId: joi.string().required(),
      channel: joi.string().required(),
      environment: joi.string(),
      declaredValue: joi.number(),
      bookingCost: joi.number().positive(),
      // category: joi.string().required(),
      document: joi.string(),
      packages: joi.array().items(
        joi.object({
          weight: joi.number(),
          description: joi.string(),
          dimensions: {
            length: joi.number().required(),
            width: joi.number().required(),
            height: joi.number().required(),
          },
        })
      ),
      description: joi.string(),
      number_items: joi.number().required(),
      value: joi.number().default(0),
      delivery_info: joi.array().items(
        joi.object({
          type: joi.string(),
          typeCode: joi.string(),
          postalAddress: {
            postalCode: joi.any(),
            cityName: joi.string().required(),
            countryCode: joi.string().length(2).required(),
            addressLine1: joi.string().required(),
            countyName: joi.string(),
          },
          contactInformation: {
            phone: joi.string().required(),
            companyName: joi.string(),
            fullName: joi.string().required(),
            email: joi.string().email(),
            mobilePhone: joi.string(),
          },
        })
      ),
      shipmentMeta: joi.object({
        trackingUrl: joi.string().required(),
        trackingId: joi.string().required(),
        packages: joi.array().items(
          joi.object({
            referenceNumber: joi.number().required(),
            trackingNumber: joi.string().required(),
            trackingUrl: joi.string().required(),
          })
        ),
        documents: joi.array().items(
          joi.object({
            imageFormat: joi.string().required(),
            content: joi.string().required(),
          })
        ),
      }),
    })
    .validate(data);
