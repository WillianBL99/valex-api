import { Request, Response } from "express";
import AppError from "../config/error.js";
import * as cardService from "../services/cardService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function rechargeCard( req: Request, res: Response ) {
  const { companyId } = res.locals.companyData;

  const cardId = parseInt( req.params.cardId );
  if( !cardId || isNaN( cardId ) ) {
    throw new AppError(
      "Bad body request",
      422,
      "Invalid card id",
      "Make sure to send a correct body request"
    );
  }

  const card = await cardService.findCard( cardId );
  if( card.isBlocked ) {
    throw new AppError(
      "Card blocked",
      401,
      "Card blocked",
      "This card is blocked. Operation unauthorized."
    );
  }

  await cardService.cardIsValid( card );
}