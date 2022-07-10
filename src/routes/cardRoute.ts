import { Router } from "express";
import { apiKeyHeaderValidation } from "../middlewares/apiKeyHeaderValidationMiddleware.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { cardActiveSchema, cardSchema } from "../schemas/cardSchema.js";
import * as cardController from "../controllers/cardController.js";

const cardRoute = Router();

cardRoute.post( "/card", validateSchema( cardSchema ), apiKeyHeaderValidation, cardController.createCard );
cardRoute.post( "/card/:id/active", validateSchema( cardActiveSchema ), cardController.activeCard );

export default cardRoute;