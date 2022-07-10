import Joi from "joi";
import { regex } from "./regexForSchemas";

export const paymentSchema = Joi.object({
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().min(1).required(),
  password: Joi.string().regex( regex.password  ).required(),
  cvv: Joi.string().regex( regex.cvv ).required()
})