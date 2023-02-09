const Joi = require("joi");

exports.validateCreateNewZoneRate = (data) =>
  Joi.object({
    type: Joi.string().valid("export", "import", "domestic").required(),
    zone: Joi.string().required(),
    document: Joi.bool().required(),
    min: Joi.number().positive().required(),
    max: Joi.number().positive().required(),
    charge: Joi.number().positive().required(),
  }).validate(data);
