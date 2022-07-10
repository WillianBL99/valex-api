import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { paymentSchema } from "../schemas/paymentSchema.js";
import * as paymentController from "../controllers/paymentController.js";

const paymentRoute = Router();

paymentRoute.post(
  "/payment/:cardId",
  validateSchema( paymentSchema ),
  paymentController.buy
)
export default paymentRoute;