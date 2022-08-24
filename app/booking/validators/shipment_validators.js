const Joi = require('joi');

exports.validateShipmentCreation = (data) =>
	Joi.object({
		plannedShippingDateAndTime: Joi.string().required(),
		declaredValue: Joi.number().required(),
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
			},
		}),
		description: Joi.string(),
		packages: Joi.array().items(
			Joi.object({
				weight: Joi.number(),
				description: Joi.string(),
				dimensions: {
					length: Joi.number().required(),
					width: Joi.number().required(),
					height: Joi.number().required(),
				},
			}),
		),
		exportDeclaration: Joi.object({
			lineItems: Joi.array().items(
				Joi.object({
					number: Joi.number().required(),
					quantity: Joi.object({
						unitOfMeasurement: Joi.string().default('PCS'),
						value: Joi.number().required(),
					}),
					price: Joi.number().required(),
					description: Joi.string().required(),
					weight: Joi.object({
						netValue: Joi.number().required(),
						grossValue: Joi.number().required(),
					}),
					exportReasonType: Joi.string().required(),
					manufacturerCountry: Joi.string().required(),
					commodityCodes: Joi.array().items(
						Joi.object({
							typeCode: Joi.string().default('outbound'),
							value: Joi.string().default('HS9876543210'),
						}),
					),
				}),
			),
			exportReason: Joi.string().required(),
			additionalCharges: Joi.array().items(
				Joi.object({
					value: Joi.number().required(),
					typeCode: Joi.string().required(),
				}),
			),
			invoice: {
				number: Joi.string().required(),
				date: Joi.string().required(),
			},
			placeOfIncoterm: Joi.string().required(),
			exportReasonType: Joi.string().required(),
			shipmentType: Joi.string().required(),
		}),
	}).validate(data);
