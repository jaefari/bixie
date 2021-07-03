const Joi = require('joi');

const atSchema = Joi.object({
  at: Joi.date().required().raw(),
});

const atKioskIdSchema = Joi.object({
  at: Joi.date().required().raw(),
  kioskId: Joi.number().required(),
});

const fromToFrequencyKioskIdSchema = Joi.object({
  from: Joi.date().required().raw(),
  to: Joi.date().required().raw(),
  frequency: Joi.string().valid('hourly', 'daily'),
  kioskId: Joi.number().required(),
});

module.exports = {
  atSchema,
  atKioskIdSchema,
  fromToFrequencyKioskIdSchema,
};
