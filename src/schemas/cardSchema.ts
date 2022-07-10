import Joi from "joi";

const cardTypes = ["groceries", "restaurants", "transport", "education", "health"];
export const cardSchema = Joi.object({
  type: Joi.string().valid(...cardTypes).required(),
  cpf: Joi.string().max(11).min(11).required()
});

const cvvRegex = /(\d){4}/;
export const cardActiveSchema = Joi.object({
  cvv: Joi.string().max(3).min(3).required(),
  password: Joi.string().regex( cvvRegex ).required()
})