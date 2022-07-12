import { Request, Response } from "express";

import * as rechargeService from "../services/rechargeService.js";
import * as validationServer from "../services/validationsServer.js";

export async function rechargeCard( req: Request, res: Response ) {
  const { companyId } = res.locals.companyData;
  const { amount } : { amount: number } = req.body;

  const cardId = validationServer.checkCardId( req.params.cardId );  
  await rechargeService.recharge({ amount, cardId, companyId });

  res.sendStatus( 201 );
}