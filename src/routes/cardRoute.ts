import { Request, Response, Router } from "express";
import { apiKeyHeaderValidation } from "../middlewares/cardMiddleware.js";
import * as cardRepository from "../repositories/cardRepository.js";

const cardRoute = Router();

cardRoute.get("/", apiKeyHeaderValidation, async ( _req: Request, res: Response ) => {
  const cards = await cardRepository.find();
  res.send({ cards });
});

export default cardRoute;