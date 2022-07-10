import { Request, Response } from "express";
import { checkCardId } from "../services/checkCardIdService.js";
import * as paymentServer from "../services/paymentService.js";

export async function buy( req: Request, res: Response ) {
  const cardId = checkCardId( req.params.cardId );
  await paymentServer.buy( cardId );
  
  res.sendStatus( 200 );
}