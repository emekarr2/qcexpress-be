const Joi = require("joi");

exports.validateFeedback = (data) => {
  return Joi.object({
    content: Joi.string().required(),
    email: Joi.string().email().required(),
    business: Joi.string().required(),
    from: Joi.string().required(),
    admin_name: Joi.string().required(),
    org_name: Joi.string().required(),
  }).validate(data);
};
