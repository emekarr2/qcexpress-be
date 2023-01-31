const Joi = require("joi");
const { joiPassword } = require("joi-password");
// const JoiPassword = Joi.extend(joiPassword);

exports.validateNewAdminPayload = (payload) =>
  Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().max(100).required(),
    password: joiPassword.string()
      .min(6)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  }).validate(payload);
