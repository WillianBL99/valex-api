import Joi from "joi";

const cardTypes = ["groceries", "restaurants", "transport", "education", "health"];
export const cardSchema = Joi.object({
  type: Joi.string().valid(...cardTypes).required(),
  cpf: Joi.string().max(11).min(11).required();
})