import Joi from "joi";

export const rechargeSchema = Joi.object({
  value: Joi.number().integer().min(1).required()
})