import Sqlstring from "sqlstring";
import connection from "../config/database.js";
import { mapObjectToUpdateQuery } from "../utils/sqlUtils.js";
import { 
  Card, 
  CardList, 
  CardBalance,
  CardInsertData, 
  CardUpdateData, 
  TransactionTypes
} from "../interfaces/cardInterface.js";

export async function find() {
  const result = await connection.query<Card>("SELECT * FROM cards");
  return result.rows;
}

export async function findById(id: number) {
  const result = await connection.query<Card, [number]>(
    "SELECT * FROM cards WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

export async function findActiveCardByEmployeeId( employId: number) {
  const result = await connection.query<CardList, [number]>(
    `SELECT 
      number,
      "cardholderName",
      "expirationDate",
      "securityCode",
      "password"
    FROM cards 
    WHERE "employeeId"=$1 AND password IS NOT NULL`,
    [ employId ]
  );

  return result.rows;
}

export async function findByTypeAndEmployeeId(
  type: TransactionTypes,
  employeeId: number
) {
  const result = await connection.query<Card, [TransactionTypes, number]>(
    `SELECT * FROM cards WHERE type=$1 AND "employeeId"=$2`,
    [type, employeeId]
  );

  return result.rows[0];
}

export async function findByCardDetails(
  number: string,
  cardholderName: string,
  expirationDate: string
) {
  const result = await connection.query<Card, [string, string, string]>(
    ` SELECT 
        * 
      FROM cards 
      WHERE number=$1 AND "cardholderName"=$2 AND "expirationDate"=$3`,
    [number, cardholderName, expirationDate]
  );

  return result.rows[0];
}

export async function insert(cardData: CardInsertData) {
  const {
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password,
    isVirtual,
    originalCardId,
    isBlocked,
    type,
  } = cardData;

  await connection.query(
    `
    INSERT INTO cards ("employeeId", number, "cardholderName", "securityCode",
      "expirationDate", password, "isVirtual", "originalCardId", "isBlocked", type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `,
    [
      employeeId,
      number,
      cardholderName,
      securityCode,
      expirationDate,
      password,
      isVirtual,
      originalCardId,
      isBlocked,
      type,
    ]
  );
}

export async function update(id: number, cardData: CardUpdateData) {
  const { objectColumns: cardColumns, objectValues: cardValues } =
    mapObjectToUpdateQuery({
      object: cardData,
      offset: 2,
    });

  connection.query(
    `
    UPDATE cards
      SET ${cardColumns}
    WHERE $1=id
  `,
    [id, ...cardValues]
  );
}

export async function balance( id: number ) {
  const paymentsAmount = `
    SELECT COALESCE(SUM(p.amount),0)
    FROM payments p
    WHERE p."cardId"=${Sqlstring.escape( id )}
  `
  const rechargesAmount = `COALESCE(SUM(r.amount),0)`;

  const { rows } = await connection.query<CardBalance, [number]>(
    `SELECT (${rechargesAmount} - (${paymentsAmount})) AS balance
    FROM recharges r
    WHERE r."cardId"=$1`,
    [ id ]
  );

  const [ balance ] = rows;
  return balance;
}

export async function remove(id: number) {
  connection.query<any, [number]>("DELETE FROM cards WHERE id=$1", [id]);
}
