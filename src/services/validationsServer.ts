import AppError from "../config/error";
import * as cardRepository from "../repositories/cardRepository.js";
import { Card } from "../repositories/cardRepository.js";
import { internalCryptr } from "../utils/encrypt";
import { getCurrentData, parseDataToInt } from "../utils/handleData";

export async function findCard( cardId: number ) {
  const card = await cardRepository.findById( cardId );
  if( !card ) {
    throw new AppError(
      "Card not found",
      404,
      "Card not found",
      "Make sure to send a valid card data"
    );
  }

  return card;
}

export function verifySecuritConde( card: Card, securityCode: string ) {
  if( internalCryptr.decrypt( card.securityCode ) !== securityCode ) {
    throw new AppError(
      "Access danied",
      401,
      "Access denied",
      "Access denied to this card"
    );
  }
}

export function cardIsValid( card: Card ) {
  const [ expiryMonth, expiryYear ] = card.expirationDate.split("/");

  const { month, year } = parseDataToInt( expiryMonth, expiryYear );
  const { currentMonth, currentYear } = getCurrentData();
  if( currentMonth > month && currentYear >= year ) {
    throw new AppError(
      "Card is expired",
      409,
      "Card is expired",
      "This card is expired. Unauthorized update."
    );
  }
}

export function cardIsUnlocked( card: Card ) {
  if( card.isBlocked ) {
    throw new AppError(
      "Card blocked",
      401,
      "Card blocked",
      "This card is blocked. Operation unauthorized."
    );
  }
}

export function checkCardId( cardIdParams: any ) {
  const cardId = parseInt( cardIdParams );
  if( !cardId || isNaN( cardId ) ) {
    throw new AppError(
      "Bad body request",
      422,
      "Invalid card id",
      "Make sure to send a correct body request"
    );
  }
  return cardId;
}