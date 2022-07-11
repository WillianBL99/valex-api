
import { faker } from "@faker-js/faker";
import { TransactionTypes } from "../repositories/cardRepository.js";
import { getCurrentData, parseDataToInt } from "../utils/handleData.js";

import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

import AppError from "../config/error.js";
import "./../config/setup.js";
import { internalBcrypt, internalCryptr } from "../utils/encrypt.js";

export interface CreateCard {
  cpf: string,
  companyId: number,
  type: TransactionTypes
}

export async function create( cardCreateData: CreateCard ) {
  const { cpf, companyId, type } = cardCreateData;

  const { id: employeeId, fullName } = await findEmployee( cpf, companyId );
  await isDifferentTypeCard( type, employeeId );

  const number = faker.unique( faker.finance.creditCardNumber );
  const cardholderName = setCardName( fullName );
  const expirationDate = setExpirationDate();
  const securityCode = setSecuritCodeCard();

  const cardInsertData : cardRepository.CardInsertData = {
    type,
    number,
    employeeId,
    securityCode,
    cardholderName,
    expirationDate,
    isBlocked: true,
    isVirtual: false
  };

  await cardRepository.insert( cardInsertData );
}

export async function active( cardId: number, securityCode: string, password: string ) {
  const card = await findCard( cardId );
  await cardIsValid( card );
  await hasNoPassword( card );
  await verifySecuritConde( card, securityCode );
  const hashedPassword = await internalBcrypt.hashValue( password );

  const updateCardData: cardRepository.CardUpdateData = {
    password: hashedPassword,
    isBlocked: false
  }

  await cardRepository.update( cardId, updateCardData );
}

export async function findCardsByEmployeeIdAndPasswords( employeeId: number, passwords: [string]) {
  const passwordAux = passwords;
  let cards: cardRepository.CardList[] = [];

  const employee = await employeeRepository.findById( employeeId );
  if( !employee ) {
    throw new AppError(
      "Employee not found",
      404,
      "Employee not found",
      "Make sure this employee is employeed by this company"
    );
  }

  const cardsResponse = await cardRepository.findActiveCardByEmployeeId( employeeId );
  for( let card of cardsResponse ) {
    for(let i = 0; i < passwordAux.length; i++){
      if(internalBcrypt.compareSync(passwordAux[i], card.password )){
        cards.push(card);
        passwordAux.splice(i,1);
      }
    }
  }

  return cards;
}

export async function findEmployee( cpf: string, companyId: number ) {
  const employee = await employeeRepository.findByCompanyIdAndCPF( cpf, companyId );

  if( !employee ) {
    throw new AppError(
      "Employee not found",
      404,
      "Employee not found",
      "Make sure this employee is employeed by this company"
    );
  }

  return employee;
}

async function isDifferentTypeCard( type: TransactionTypes , employeeId: number ) {
  const findCardSameType = await cardRepository.findByTypeAndEmployeeId( type, employeeId );
  if( findCardSameType ) {
    throw new AppError(
      "there was a conflict creating this card type",
      409,
      "there was a conflict creating this card type",
      "make sure this employee does not have a card of the same type"
    );
  }
}

function setCardName( fullName: string ) {
  const nameLongerThanThreeLetters = /(\w){3,}/g;
  const splitName = fullName.match( nameLongerThanThreeLetters );

  const containMiddleName = splitName && splitName?.length >= 3;

  if( containMiddleName ) {
    for( let i = 1; i < splitName.length - 1; i++ ) {
      splitName[i] = splitName[i].slice(0,1);
    }
  }

  const cardName = splitName?.join(" ").toUpperCase() || "";

  return cardName;
}

function setExpirationDate() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const expirationTime = 5;
  const expiryYear = ( currentYear + expirationTime ) % 100;

  const padStartZero = ( value: number ) => {
    return String(value).padStart(2,"0");
  }

  const expirationDate = `${ padStartZero(currentMonth) }/${ padStartZero(expiryYear) }`;

  return expirationDate;
}

function setSecuritCodeCard() {
  const securityCode = internalCryptr.encrypt(
    faker.finance.creditCardCVV()
  );

  return securityCode;
}

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

export async function cardIsValid( card: cardRepository.Card ) {
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

async function hasNoPassword( card: cardRepository.Card ) {
  if( card.password ) {
    throw new AppError(
      "Card already has password",
      409,
      "Card already has password",
      "This card already has password. Unauthorized update."
    );
  }
}

export async function verifySecuritConde( card: cardRepository.Card, securityCode: string ) {
  if( internalCryptr.decrypt( card.securityCode ) !== securityCode ) {
    throw new AppError(
      "Access danied",
      401,
      "Access denied",
      "Access denied to this card"
    );
  }
}