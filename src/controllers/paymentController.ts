import { Request, Response } from "express";
import { checkCardId } from "../services/checkCardIdService.js";
import * as paymentServer from "../services/paymentService.js";

export interface PaymentCardBody {
  amount: number,
  businessId: number,
  cvv: string
}
export async function buy( req: Request, res: Response ) {
  const { amount, businessId, cvv }: PaymentCardBody = req.body;
  const cardId = checkCardId( req.params.cardId );

  const paymentCardData: paymentServer.PaymentCard = {
    amount,
    businessId,
    cardId,
    cvv
  }
  
  await paymentServer.buy( paymentCardData );

  res.sendStatus( 200 );
}