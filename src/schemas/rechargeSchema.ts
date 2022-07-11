import Joi from "joi";
import { amount } from "./porpertiesSchema";

export const rechargeSchema = Joi.object({ amount });