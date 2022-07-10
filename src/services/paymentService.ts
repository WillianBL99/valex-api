import AppError from "../config/error.js";
import { cardIsValid, findCard, verifySecuritConde } from "./cardService.js";
import { cardIsUnlocked } from "./rechargeService.js";
import * as businessRepository from "../repositories/businessRepository.js";
import { Card } from "../repositories/cardRepository.js";
import { Business } from "../repositories/businessRepository.js";

export async function buy( cardId: number, cvv: string, businessId: number, amount: number ) {
  const card = await findCard( cardId );
  if( !card.password ) {
    throw new AppError(
      "Card is disabled",
      409,
      "Card is disabled",
      "Active card before"
    );
  }
  cardIsValid( card );
  cardIsUnlocked( card );
  await verifySecuritConde( card, cvv );

  const business = await businessRepository.findById( businessId );
  if( !business ) {
    throw new AppError(
      "Business not found",
      404,
      "Business not found",
      "Make sure to send a currect business id"
    );
  }

  areTheSameType( card, business );
  // criar função para retorna o montante atual do cartão
}

function areTheSameType( card: Card, business: Business) {
  if( card.type !== business.type ) {
    throw new AppError(
      "Card is different type to business",
      409,
      "Card is different type to business",
      "Make sure you pay with a correct card"
    );
  }
}