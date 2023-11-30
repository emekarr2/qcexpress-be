const Joi = require("joi");
const { joiPassword } = require("joi-password");

exports.validateNewAdminPayload = (payload) =>
  Joi.object({
    firstname: Joi.string().max(50).required(),
    lastname: Joi.string().max(50).required(),
    business: Joi.string().max(50).required(),
    org_name: Joi.string().max(50).required(),
    email: Joi.string().email().max(100).required(),
    password: joiPassword
      .string()
      .min(6)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
    access_tier: Joi.string(),
  }).validate(payload);
