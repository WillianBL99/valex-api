import { Request, Response } from "express";
import AppError from "../config/error.js";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";

export interface CreateCardBody {
  cpf: string,
  type: TransactionTypes
}

export interface ActiveCardBody {
  cvv: number,
  password: string
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

export async function activeCard( req: Request, res: Response ) {
  const cardId = parseInt( req.params.id );
  const { cvv, password } : ActiveCardBody = req.body;

  if( !cardId || isNaN( cardId ) ) {
    throw new AppError(
      "Bad body request",
      422,
      "Invalid card id",
      "Make sure to send a correct body request"
    )
  }

  const securityCode = cvv.toString();
  await cardService.active( cardId, securityCode, password );

  res.sendStatus( 200 );
}