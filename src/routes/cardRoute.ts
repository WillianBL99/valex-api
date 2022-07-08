import { Request, Response, Router } from "express";
import { apiKeyHeaderValidation } from "../middlewares/cardMiddleware.js";
import { validateSchema } from "../middlewares/validateSchemaMiddleware.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { cardSchema } from "../schemas/cardSchema.js";

const cardRoute = Router();

cardRoute.get("/", validateSchema( cardSchema ), apiKeyHeaderValidation, async ( _req: Request, res: Response ) => {
  const cards = await cardRepository.find();
  res.send({ cards });
});

export default cardRoute;