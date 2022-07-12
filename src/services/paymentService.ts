import { Card } from "../repositories/cardRepository.js";
import { Business } from "../repositories/businessRepository.js";
import { cardIsValid, findCard, verifySecuritConde } from "./validationsServer.js";

import * as businessRepository from "../repositories/businessRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as validationService from "../services/validationsServer.js";

import AppError from "../config/error.js";

export interface PaymentCard {
  cardId: number,
  cvv: string,
  businessId: number,
  amount: number
}

export async function buy( paymentCardData: PaymentCard ) {
  const { amount, businessId, cardId, cvv } = paymentCardData;
  
  const card = await findCard( cardId );
  verifySecuritConde( card, cvv );
  cardIsActive( card );
  cardIsValid( card );
  validationService.cardIsUnlocked( card );
  await hasEnoughBalance( cardId, amount );

  const business = await findBusiness( businessId );
  areTheSameType( card, business );

  await paymentRepository.insert({ amount, businessId, cardId });
}

function cardIsActive( card: Card ) {
  if( !card.password ) {
    throw new AppError(
      "Card is disabled",
      409,
      "Card is disabled",
      "Active card before"
    );
  }
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

async function findBusiness( businessId: number ) {
  const business = await businessRepository.findById( businessId );
  if( !business ) {
    throw new AppError(
      "Business not found",
      404,
      "Business not found",
      "Make sure to send a currect business id"
    );
  }

  return business;
}

async function hasEnoughBalance( cardId: number, amount: number ) {
  const { balance } = await cardRepository.balance( cardId );
  if( balance < amount ) {
    throw new AppError(
      "Don't have enough balance",
      409,
      "Don't have enough balance",
      "Check your balance"
    );
  }
}