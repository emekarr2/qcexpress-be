const Joi = require("joi");

const validateOnboardingRequest = (data) =>
  Joi.object({
    email: Joi.string().email().required(),
    company_name: Joi.string().max(30).required(),
    firstname: Joi.string().max(30).required(),
    lastname: Joi.string().max(30).required(),
    website: Joi.string().uri().max(30).required(),
    phonenumber: Joi.string().max(11),
    company_description: Joi.string().max(200).required(),
    intent: Joi.string().max(200).required(),
  }).validate(data);

module.exports = {
  validateOnboardingRequest,
};
