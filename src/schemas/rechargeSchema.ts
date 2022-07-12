import Joi from "joi";
import { amount } from "./porpertiesSchema.js";

export const rechargeSchema = Joi.object({ amount });
