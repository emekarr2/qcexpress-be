const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const JoiPassword = Joi.extend(joiPasswordExtendCore);

export const validateNewAdminPayload = (payload) =>
  Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().max(100).required(),
    password: JoiPassword.string()
      .min(6)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  }).validate(payload);
