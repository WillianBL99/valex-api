import Joi from "joi";
import { cvv, password, amount, businessId } from "./porpertiesSchema.js";

export const paymentSchema = Joi.object({
  cvv,
  amount,
  password,
  businessId,
});
