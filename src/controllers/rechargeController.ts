import { Request, Response } from "express";
import AppError from "../config/error.js";
import * as cardService from "../services/cardService.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

export async function rechargeCard( req: Request, res: Response ) {
  const { companyId } = res.locals.companyData;
  const { amount } : { amount: number } = req.body;

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