const { Schema, model } = require('mongoose');

const OtpSchema = new Schema({
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
});

module.exports = model('Otp', OtpSchema);
