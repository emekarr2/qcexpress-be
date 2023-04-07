const { Schema, model } = require('mongoose');
const hasher = require('../../authentication/hasher');
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new Schema(
	{
		country: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			index: true,
			required: true,
		},
		verified_email: {
			type: Boolean,
			default: false,
		},
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			unique: true,
			required: true,
			index: true,
			maxlength: 10,
		},
		phonenumber: {
			type: String,
			unique: true,
			required: true,
			index: true,
		},
		verified_mobile: {
			type: Boolean,
			default: false,
		},
		city: {
			type: String,
		},
		state: {
			type: String,
		},
		address: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
		referral: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true },
);

UserSchema.plugin(mongoosePaginate);


UserSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await hasher.hashPassword(this.password);
	}
	next();
});

UserSchema.method('toJSON', function () {
	const user = this.toObject();
	delete user.__v;
	delete user.password;
	return user;
});

module.exports = model('User', UserSchema);
