import AppError from "../config/error.js";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import "./../config/setup.js";

export interface CreateCard {
  cpf: string,
  companyId: number,
  type: TransactionTypes
}

export async function create( cardCreateData: CreateCard ) {
  const { cpf, companyId, type } = cardCreateData;

  const employee = await employeeRepository.findByCompanyIdAndCPF( cpf, companyId );

  if( !employee ) {
    throw new AppError(
      "Employee not found",
      404,
      "Employee not found",
      "Make sure this employee is employeed by this company"
    )
  }

  const findCardSameType = await cardRepository.findByTypeAndEmployeeId( type, employee.id );
  if( findCardSameType ) {
    throw new AppError(
      "there was a conflict creating this card type",
      409,
      "there was a conflict creating this card type",
      "make sure this employee does not have a card of the same type"
    )
  }

  const cardNumber = faker.unique( faker.finance.creditCardNumber );

  const nameLongerThanThreeLetters = /(\w){3,}/g;
  const splitName = employee.fullName.match( nameLongerThanThreeLetters );

  const containMiddleName = splitName && splitName?.length >= 3;
  if( containMiddleName ) {
    for( let i = 1; i < splitName.length - 1; i++ ) {
      splitName[i] = splitName[i].slice(0,1);
    }
  }

  const cardName = splitName?.join(" ").toUpperCase() || "";

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const expirationTime = 5;
  const expiryYear = ( currentYear + expirationTime ) % 100;

  const padStartZero = ( value: number ) => {
    return String(value).padStart(2,"0");
  }

  const expirationDate = `${ padStartZero(currentMonth) }/${ padStartZero(expiryYear) }`;


  const cryptr = new Cryptr( "" + process.env.SECRET_CRYPTR );
  const securityCode = cryptr.encrypt( faker.finance.creditCardCVV() );

  const cardInsertData : cardRepository.CardInsertData = {
    type,
    securityCode,
    expirationDate,
    number: cardNumber,
    isBlocked: true,
    isVirtual: false,
    employeeId: employee.id,
    cardholderName: cardName
  };

  await cardRepository.insert( cardInsertData );
}