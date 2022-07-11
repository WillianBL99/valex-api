import Joi from "joi";
import { regex } from "./regexForSchemas";

const CARD_TYPES = ["groceries", "restaurants", "transport", "education", "health"];

const JOI_ID = Joi.number().integer().required();

const cpf = Joi.string().max(11).min(11).required();
const cvv = Joi.string().regex( regex.cvv ).required();0
const type = Joi.string().valid(...CARD_TYPES).required();
const amount = Joi.number().integer().min(1).required();
const password = Joi.string().regex( regex.password ).required();
const employeeId = JOI_ID;
const businessId = JOI_ID;

export { password, type, cpf, cvv, employeeId, amount, businessId };