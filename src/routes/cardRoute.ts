import { Router } from "express";
import { apiKeyHeaderValidation } from "../middlewares/apiKeyHeaderValidationMiddleware.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import { cardActiveSchema, blockCardSchema, cardSchema, infoCards } from "../schemas/cardSchema.js";
import * as cardController from "../controllers/cardController.js";

const cardRoute = Router();

cardRoute.post( "/card", validateSchema( cardSchema ), apiKeyHeaderValidation, cardController.createCard );
cardRoute.post( "/card/:id/active", validateSchema( cardActiveSchema ), cardController.activeCard );
cardRoute.post( "/cards/info", validateSchema( infoCards ), cardController.infoCards );
cardRoute.post( "/card/block/:id", validateSchema( blockCardSchema ), cardController.blockCard );

export default cardRoute;