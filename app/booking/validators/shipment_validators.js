const Joi = require("joi");

exports.validateShipmentCreation = (data) =>
  Joi.object({
    plannedShippingDateAndTime: Joi.string().required(),
    pickup: Joi.bool().default(false),
    declaredValue: Joi.number().required(),
    deliveryType: Joi.string().allow("export", "domestic", "import").required(),
    content: Joi.object({
      packages: Joi.array().items(
        Joi.object({
          weight: Joi.number(),
          description: Joi.string(),
          dimensions: {
            length: Joi.number().required(),
            width: Joi.number().required(),
            height: Joi.number().required(),
          },
        })
      ),
      declaredValue: Joi.number().positive().required(),
      isCustomsDeclarable: Joi.bool().required(),
      description: Joi.string(),
      exportDeclaration: Joi.object({
        invoice: {
          number: Joi.string().default(1),
          date: Joi.date().default(new Date()),
        },
        lineItems: Joi.array().items(
          Joi.object({
            number: Joi.number().required(),
            quantity: Joi.object({
              unitOfMeasurement: Joi.string().default("PCS"),
              value: Joi.number().required(),
            }),
            price: Joi.number().required(),
            description: Joi.string().required(),
            weight: Joi.object({
              netValue: Joi.number().required(),
              grossValue: Joi.number().required(),
            }),
            isTaxesPaid: Joi.bool(),
            "manufacturerCountry": Joi.string()
          })
        ),
        packageMarks: Joi.string().max(300),
        exportReason: Joi.string().max(300),
        remarks: Joi.array().items(
          Joi.object({
            value: Joi.string().max(300),
          })
        ),
      }),
    }),
    sender: Joi.object({
      postalAddress: {
        postalCode: Joi.any(),
        cityName: Joi.string().required(),
        countryCode: Joi.string().length(2).required(),
        addressLine1: Joi.string().required(),
        countyName: Joi.string(),
      },
      contactInformation: {
        phone: Joi.string().required(),
        companyName: Joi.string(),
        fullName: Joi.string().required(),
        email: Joi.string().email(),
        mobilePhone: Joi.string(),
      },
    }),
    receiver: Joi.object({
      postalAddress: {
        postalCode: Joi.any(),
        cityName: Joi.string().required(),
        countryCode: Joi.string().length(2).required(),
        addressLine1: Joi.string().required(),
        countyName: Joi.string(),
      },
      contactInformation: {
        phone: Joi.string().required(),
        companyName: Joi.string(),
        fullName: Joi.string().required(),
        email: Joi.string().email(),
        mobilePhone: Joi.string(),
      },
    }),
  }).validate(data);
