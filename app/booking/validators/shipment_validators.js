const Joi = require('joi');

exports.validateShipmentCreation = (data) =>
	Joi.object({
		plannedShippingDateAndTime: Joi.string().required(),
		sender: Joi.object({
			postalAddress: {
				postalCode: Joi.string(),
				cityName: Joi.string().required(),
				countryCode: Joi.string().length(2).required(),
				addressLine1: Joi.string().required(),
				countyName: Joi.string(),
			},
			contactInformation: {
				phone: Joi.string().length(14).required(),
				companyName: Joi.string(),
				fullName: Joi.string().required(),
				email: Joi.string().email(),
			},
		}),
		receiver: Joi.object({
			postalAddress: {
				postalCode: Joi.string(),
				cityName: Joi.string().required(),
				countryCode: Joi.string().length(2).required(),
				addressLine1: Joi.string().required(),
				countyName: Joi.string(),
			},
			contactInformation: {
				phone: Joi.string().length(14).required(),
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
	}).validate(data);
