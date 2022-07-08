import { Request, Response, Router } from "express";
import * as cardRepository from "../repositories/cardRepository.js";

const router = Router();

router.get("/", async ( _req: Request, res: Response ) => {
  const cards = await cardRepository.find();
  res.send({ cards });
})

export default router;