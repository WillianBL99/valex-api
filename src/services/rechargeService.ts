
import * as cardService from "../services/cardService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

import AppError from "../config/error.js";

export interface RechargeCard {
  cardId: number,
  companyId: number,
  amount: number
}

export async function recharge( rechardData: RechargeCard ) {
  const { cardId, companyId, amount } = rechardData;
  
  const card = await cardService.findCard( cardId );
  if( card.isBlocked ) {
    throw new AppError(
      "Card blocked",
      401,
      "Card blocked",
      "This card is blocked. Operation unauthorized."
    );
  }

  const employee = await employeeRepository.findById( card.employeeId );
  if( employee.companyId !== companyId ) {
    throw new AppError(
      "Employee not found",
      404,
      "Employee not found",
      "Make sure this employee is employeed by this company"
    );
  }

  await cardService.cardIsValid( card );

  await rechargeRepository.insert({ amount, cardId })
}