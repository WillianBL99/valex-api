
import { faker } from "@faker-js/faker";
import { getCurrentData } from "../utils/handleData.js";
import { internalBcrypt, internalCryptr } from "../utils/encrypt.js";
import { 
  Card, 
  CardInsertData, 
  CardList, 
  CardUpdateData, 
  CreateCard, 
  TransactionTypes
} from "../interfaces/cardInterface.js";

import * as cardRepository from "../repositories/cardRepository.js";
import * as validationServer from "../services/validationsServer.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

import AppError from "../config/error.js";
import "./../config/setup.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

export async function create( cardCreateData: CreateCard ) {
  const { cpf, companyId, type } = cardCreateData;

  const { id: employeeId, fullName } = await findEmployee( cpf, companyId );
  await isDifferentTypeCard( type, employeeId );

  const number = faker.unique( faker.finance.creditCardNumber );
  const cardholderName = setCardName( fullName );
  const expirationDate = setExpirationDate();
  const securityCode = setSecuritCodeCard();

  const cardInsertData : CardInsertData = {
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
  const card = await validationServer.findCard( cardId );
  validationServer.verifySecuritConde( card, securityCode );
  validationServer.cardIsValid( card );
  hasNoPassword( card );
  const hashedPassword = await internalBcrypt.hashValue( password );

  const updateCardData: CardUpdateData = {
    password: hashedPassword,
    isBlocked: false
  }

  await cardRepository.update( cardId, updateCardData );
}

export async function balanceAndTransactions( cardId: number ) {
  await validationServer.findCard( cardId );
  const { balance } = await cardRepository.balance( cardId );
  const transactions = await paymentRepository.findByCardId( cardId );
  const recharges = await rechargeRepository.findByCardId( cardId );

  return { balance, transactions, recharges };
}

export async function findCardsByEmployeeIdAndPasswords( employeeId: number, passwords: [string]) {

  await employeeIsEmployed( employeeId );
  const cards = await handleListCardRequest( employeeId, passwords );

  return cards;
}

export async function blockCard( cardId:number, password: string ) {
  const card = await validationServer.findCard( cardId );
  verifyPassword( card, password );
  validationServer.cardIsValid( card );
  validationServer.cardIsUnlocked( card );
  
  const cardBlockData = { isBlocked: true };
  await cardRepository.update( cardId, cardBlockData );
}

export async function unlockCard( cardId:number, password: string ) {
  const card = await validationServer.findCard( cardId );
  verifyPassword( card, password );
  validationServer.cardIsValid( card );
  cardIsBlockd( card );
  
  const cardBlockData = { isBlocked: false };
  await cardRepository.update( cardId, cardBlockData );
}

function setCardName( fullName: string ) {
  const nameLongerThanThreeLetters = /(\w){3,}/g;
  const splitName = fullName.match( nameLongerThanThreeLetters );

  const containMiddleName = splitName && splitName?.length >= 3;

  if( containMiddleName ) {
    reduceMiddleName( splitName );
  }

  const cardName = splitName?.join(" ").toUpperCase() || "";

  return cardName;
}

function reduceMiddleName( arrayFullName: RegExpMatchArray ) {
  for( let i = 1; i < arrayFullName.length - 1; i++ ) {
    arrayFullName[i] = arrayFullName[i].slice(0,1);
  }
}

function setExpirationDate() {
  const { currentMonth, currentFullYear } = getCurrentData();
  const expirationTime = 5;
  const expiryYear = ( currentFullYear + expirationTime ) % 100;

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

async function handleListCardRequest( employeeId: number, passwords: [string]) {
  let cards: CardList[] = [];
  const passwordAux = [...passwords];

  const cardsResponse = await cardRepository.findActiveCardByEmployeeId( employeeId );
  
  for( let card of cardsResponse ) {
    for(let i = 0; i < passwordAux.length; i++){
      const approvedPassword = internalBcrypt.compareSync(
        passwordAux[i], card.password
      );

      if( approvedPassword ){
        const securityCode = internalCryptr.decrypt( card.securityCode );
        cards.push({...card, securityCode });
        passwordAux.splice(i,1);
      }
    }
  }

  return cards;
}

function hasNoPassword( card: Card ) {
  if( card.password ) {
    throw new AppError(
      "Card already has password",
      409,
      "Card already has password",
      "This card already has password. Unauthorized update."
    );
  }
}

export function verifyPassword( card: Card, password: string ) {
  const hashedPassword = card.password as string;

  if( !internalBcrypt.compareSync( password, hashedPassword ) ) {
    throw new AppError(
      "Access danied",
      401,
      "Access denied",
      "Access denied to this card"
    );
  }
}

async function employeeIsEmployed( employeeId: number ) {
  const employee = await employeeRepository.findById( employeeId );
  if( !employee ) {
    throw new AppError(
      "Employee not found",
      404,
      "Employee not found",
      "Make sure this employee is employeed by this company"
    );
  }
}

function cardIsBlockd( card: Card ) {
  if( !card.isBlocked ) {
    throw new AppError(
      "Card alread unlocked",
      401,
      "Card alread unlocked",
      "This card alread unlocked. Operation unauthorized."
    );
  }
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