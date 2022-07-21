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
		weight: {
			type: Number,
			required: true,
		},
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
			full_address: String,
			city: String,
			state: String,
			country: String,
			post_code: Number,
			phone: Number,
			date: Number,
			name: String,
			house_number: String,
		},
		tracking_id: {
			type: String,
			required: true,
			index: true,
			unique: true,
		},
	},
	{ timestamps: true, toJSON: { getters: true } },
);

module.exports = model('Booking', BookingSchema);
