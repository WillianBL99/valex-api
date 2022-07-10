import { Request, Response } from "express";
import { checkCardId } from "../services/checkCardIdService.js";
import * as rechargeService from "../services/rechargeService.js";

export async function rechargeCard( req: Request, res: Response ) {
  const { companyId } = res.locals.companyData;
  const { amount } : { amount: number } = req.body;

  const cardId = checkCardId( req.params.cardId );  
  await rechargeService.recharge({ amount, cardId, companyId });

  res.sendStatus( 201 );
}