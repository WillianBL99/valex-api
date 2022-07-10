import { Request, Response } from "express";
import AppError from "../config/error.js";
import * as cardRepository from "../services/cardService.js";

export async function rechargeCard( req: Request, res: Response ) {
  const { companyId } = res.locals.companyData;

  const cardId = parseInt( req.params.cardId );
  if( !cardId || isNaN( cardId ) ) {
    throw new AppError(
      "Bad body request",
      422,
      "Invalid card id",
      "Make sure to send a correct body request"
    )
  }

  const card = await cardRepository.findCard( cardId );
}