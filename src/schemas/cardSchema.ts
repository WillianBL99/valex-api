import Joi from "joi";

const cardTypes = ["groceries", "restaurants", "transport", "education", "health"];
export const cardSchema = Joi.object({
  type: Joi.string().valid(...cardTypes).required()
})