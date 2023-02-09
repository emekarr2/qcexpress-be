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

exports.validateUpdateNewZoneRate = (data) =>
  Joi.object({
    type: Joi.string().valid("export", "import", "domestic"),
    zone: Joi.string(),
    document: Joi.bool(),
    min: Joi.number().positive(),
    max: Joi.number().positive(),
    charge: Joi.number().positive(),
  }).validate(data);
