import { Card } from "../interfaces/cardInterface.js";
import { RechargeCard } from "../interfaces/rechargeInterface.js";

import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as validationServer from "../services/validationsServer.js";

import AppError from "../config/error.js";

export async function recharge( rechardData: RechargeCard ) {
  const { cardId, companyId, amount } = rechardData;

  const card = await validationServer.findCard( cardId );
  validationServer.cardIsUnlocked( card );
  employeeIsEployed( card, companyId );
  validationServer.cardIsValid( card );
  
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