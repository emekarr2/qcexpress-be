const Joi = require('joi');
const { joiPassword } = require('joi-password');

const validateNewUser = (data) =>
	Joi.object({
		country: Joi.string().max(50).required(),
		email: Joi.string().email().required(),
		firstname: Joi.string().max(50).required(),
		lastname: Joi.string().max(50).required(),
		username: Joi.string().alphanum().max(10).required(),
		phonenumber: Joi.string().max(30).required(),
		city: Joi.string().max(50).required(),
		state: Joi.string().max(50).required(),
		address: Joi.string().max(50).required(),
		password: joiPassword
			.string()
			.min(7)
			.minOfSpecialCharacters(1)
			.minOfLowercase(1)
			.minOfUppercase(1)
			.minOfNumeric(1)
			.noWhiteSpaces()
			.required(),
		referral: Joi.string().required(),
	}).validate(data);

const validateUpdateUser = (data) =>
	Joi.object({
		country: Joi.string().max(50),
		email: Joi.string().email(),
		firstname: Joi.string().max(50),
		lastname: Joi.string().max(50),
		username: Joi.string().alphanum().max(50),
		phonenumber: Joi.string().max(30),
		city: Joi.string().max(50),
		state: Joi.string().max(50),
		address: Joi.string().max(50),
		password: joiPassword
			.string()
			.min(7)
			.minOfSpecialCharacters(1)
			.minOfLowercase(1)
			.minOfUppercase(1)
			.minOfNumeric(1)
			.noWhiteSpaces(),
	}).validate(data);

module.exports = {
	validateNewUser,
	validateUpdateUser,
};
