import Joi from "joi";
import { regex } from "./regexForSchemas.js";
const password = Joi.string().regex( regex.password ).required();

const cardTypes = ["groceries", "restaurants", "transport", "education", "health"];
export const cardSchema = Joi.object({
  type: Joi.string().valid(...cardTypes).required(),
  cpf: Joi.string().max(11).min(11).required()
});

export const cardActiveSchema = Joi.object({
  cvv: Joi.string().regex( regex.cvv ).required(),
  password: password
});

export const infoCards = Joi.object({
  passwords: Joi.array().items( password ).required(),
  employeeId: Joi.number().integer().required()
})