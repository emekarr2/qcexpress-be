const Joi = require("joi");

module.exports = (data) =>
  Joi.object({
    type: Joi.string().allow("export", "import", "domestic").required(),
    zone: Joi.string().required(),
    document: Joi.bool().required(),
    min: Joi.number().positive().required(),
    max: Joi.number().positive().required(),
    charge: Joi.number().positive().required(),
  }).validate(data);
