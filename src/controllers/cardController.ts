import { Request, Response } from "express";
import { CreateCard, TransactionTypes } from "../interfaces/cardInterface.js";

import * as cardService from "../services/cardService.js";
import * as validationServer from "../services/validationsServer.js";

export interface CreateCardBody {
  cpf: string;
  type: TransactionTypes;
}

export interface ActiveCardBody {
  cvv: number;
  password: string;
}

export interface CardListBody {
  passwords: [string];
  employeeId: number;
}

export async function createCard(req: Request, res: Response) {
  const { cpf, type }: CreateCardBody = req.body;
  const { companyId } = res.locals.companyData;

  const cardCreateData: CreateCard = {
    companyId,
    cpf,
    type,
  };

  await cardService.create(cardCreateData);
  res.sendStatus(201);
}

export async function activeCard(req: Request, res: Response) {
  const { cvv, password }: ActiveCardBody = req.body;

  const cardId = validationServer.checkCardId(req.params.id);

  const securityCode = cvv.toString();
  await cardService.active(cardId, securityCode, password);
  res.sendStatus(200);
}

export async function balanceAndTransactions(req: Request, res: Response) {
  const cardId = validationServer.checkCardId(req.params.id);
  const trasactionAndBalanceData = await cardService.balanceAndTransactions(
    cardId
  );

  res.send({ trasactionAndBalanceData });
}

export async function infoCards(req: Request, res: Response) {
  const { passwords, employeeId }: CardListBody = req.body;

  const cards = await cardService.findCardsByEmployeeIdAndPasswords(
    employeeId,
    passwords
  );

  res.send({ cards });
}

export async function blockCard(req: Request, res: Response) {
  const { password }: { password: string } = req.body;
  const cardId = validationServer.checkCardId(req.params.id);

  await cardService.blockCard(cardId, password);
  res.sendStatus(200);
}

export async function unlock(req: Request, res: Response) {
  const { password }: { password: string } = req.body;
  const cardId = validationServer.checkCardId(req.params.id);

  await cardService.unlockCard(cardId, password);
  res.sendStatus(200);
}
