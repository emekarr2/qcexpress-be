const { model, Schema } = require('mongoose');

let BookingSchema = new Schema(
	{
		category: {
			type: String,
			required: true,
		},
		shipment_type: {
			type: String,
			enum: ['DOCUMENT', 'PACKAGE'],
			default: 'PACKAGE',
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
		value: {
			type: Number,
			default: 0,
			get: (v) => (v / 100).toFixed(2),
			set: (v) => v * 100,
		},
		delivery_info: {
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
	{ timestamps: true, toJSON: { getters: true } },
);

module.exports = model('Booking', BookingSchema);
