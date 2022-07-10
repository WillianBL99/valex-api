import Joi from "joi";

const cvvRegex = /(\d){4}/;
export const paymentSchema = Joi.object({
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().min(1).required(),
  password: Joi.string().regex( cvvRegex ).required()
})