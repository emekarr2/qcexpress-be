const joi = require('joi');

const validateBooking = (data) =>
	joi
		.object({
			category: joi.string().required(),
			shipment_type: joi.string().default('PACKAGE'),
			weight: joi.number().required(),
			length: joi.number().required(),
			width: joi.number().required(),
			height: joi.number().required(),
			description: joi.string(),
			number_items: joi.number().required(),
			value: joi.number().default(0),
			delivery_info: joi.object({
				full_address: joi.string(),
				city: joi.string(),
				state: joi.string(),
				country: joi.string(),
				post_code: joi.number(),
				phone: joi.number(),
				date: joi.number(),
				name: joi.string(),
				house_number: joi.string(),
			}),
			tracking_id: joi.string().required(),
		})
		.validate(data);
