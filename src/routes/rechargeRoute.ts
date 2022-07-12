import { Router } from "express";
import { apiKeyHeaderValidation } from "../middlewares/apiKeyHeaderValidationMiddleware.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { rechargeSchema } from "../schemas/rechargeSchema.js";
import * as rechargeController from "../controllers/rechargeController.js";

const rechargeRoute = Router();

rechargeRoute.post(
  "/recharge/:cardId",
  validateSchema(rechargeSchema),
  apiKeyHeaderValidation,
  rechargeController.rechargeCard
);

export default rechargeRoute;
