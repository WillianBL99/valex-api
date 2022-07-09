import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";

export interface CreateCardBody {
  cpf: string,
  type: TransactionTypes
}

export async function createCard( req: Request, res: Response ) {
  const { cpf, type } : CreateCardBody = req.body;
  const { companyId } = res.locals.companyData;

  const cardCreateData: cardService.CreateCard = {
    companyId,
    cpf,
    type
  }

  await cardService.create( cardCreateData );

  res.sendStatus( 201 );
}