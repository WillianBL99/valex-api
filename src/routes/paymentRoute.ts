import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchemaMiddleware";
import { paymentSchema } from "../schemas/paymentSchema";
import * as paymentController from "../controllers/paymentController.js";

const paymentRoute = Router();

paymentRoute.post(
  "/payment/:cardId",
  validateSchema( paymentSchema ),
  paymentController.buy
)
export default paymentRoute;