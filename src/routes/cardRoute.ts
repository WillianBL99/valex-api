import { Router } from "express";
import { apiKeyHeaderValidation } from "../middlewares/apiKeyHeaderValidationMiddleware.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import {
  cardActiveSchema,
  handleCardIsBlockedSchema,
  cardSchema,
  infoCards,
} from "../schemas/cardSchema.js";
import * as cardController from "../controllers/cardController.js";

const cardRoute = Router();

cardRoute.get("/card/:id/transactions", cardController.balanceAndTransactions);

cardRoute.post(
  "/card/create",
  validateSchema(cardSchema),
  apiKeyHeaderValidation,
  cardController.createCard
);
cardRoute.post(
  "/card/:id/active",
  validateSchema(cardActiveSchema),
  cardController.activeCard
);
cardRoute.post(
  "/cards/info",
  validateSchema(infoCards),
  cardController.infoCards
);
cardRoute.post(
  "/card/block/:id",
  validateSchema(handleCardIsBlockedSchema),
  cardController.blockCard
);
cardRoute.post(
  "/card/unlock/:id",
  validateSchema(handleCardIsBlockedSchema),
  cardController.unlock
);

export default cardRoute;
