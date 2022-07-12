import { PaymentCard } from "../interfaces/paymentInterface.js";
import { Request, Response } from "express";

import * as paymentServer from "../services/paymentService.js";
import * as validationServer from "../services/validationsServer.js";

export interface PaymentCardBody {
  amount: number;
  businessId: number;
  cvv: string;
}
export async function buy(req: Request, res: Response) {
  const { amount, businessId, cvv }: PaymentCardBody = req.body;
  const cardId = validationServer.checkCardId(req.params.cardId);

  const paymentCardData: PaymentCard = {
    amount,
    businessId,
    cardId,
    cvv,
  };

  await paymentServer.buy(paymentCardData);

  res.sendStatus(200);
}
