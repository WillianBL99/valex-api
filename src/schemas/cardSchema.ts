import Joi from "joi";
import { cpf, cvv, employeeId, password, type } from "./porpertiesSchema.js";

export const cardSchema = Joi.object({ type, cpf });
export const cardActiveSchema = Joi.object({ cvv, password });
export const handleCardIsBlockedSchema = Joi.object({ password });

export const infoCards = Joi.object({
  employeeId,
  passwords: Joi.array().items(password).required(),
});
