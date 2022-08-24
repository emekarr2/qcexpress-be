const { Schema, model } = require('mongoose');

const OtpSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
			index: true,
		},
		code: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

OtpSchema.index({ createdAt: 1 }, { expires: '120s' });

module.exports = model('Otp', OtpSchema);
