import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";

export async function createCard( req: Request, res: Response ) {
  const { cpf } = req.body;
  const { id: companyId } = res.locals.companyData;

  await cardService.create( cpf, companyId );

}