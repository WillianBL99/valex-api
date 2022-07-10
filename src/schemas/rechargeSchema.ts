import Joi from "joi";

export const rechargeSchema = Joi.object({
  amount: Joi.number().integer().min(1).required()
})