import { Card } from "../repositories/cardRepository.js";

import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as validationService from "../services/validationsServer.js";

import AppError from "../config/error.js";

export interface RechargeCard {
  cardId: number,
  companyId: number,
  amount: number
}

export async function recharge( rechardData: RechargeCard ) {
  const { cardId, companyId, amount } = rechardData;

  const card = await validationService.findCard( cardId );
  validationService.cardIsUnlocked( card );
  employeeIsEployed( card, companyId );
  validationService.cardIsValid( card );
  
  await rechargeRepository.insert({ amount, cardId })
}

async function employeeIsEployed( card: Card, companyId: number ) {
  const employee = await employeeRepository.findById( card.employeeId );
  if( employee.companyId !== companyId ) {
    throw new AppError(
      "Employee not found",
      404,
      "Employee not found",
      "Make sure this employee is employeed by this company"
    );
  }
}