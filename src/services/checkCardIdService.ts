import AppError from "../config/error.js";

export function checkCardId( cardIdParams: any ) {
  const cardId = parseInt( cardIdParams );
  if( !cardId || isNaN( cardId ) ) {
    throw new AppError(
      "Bad body request",
      422,
      "Invalid card id",
      "Make sure to send a correct body request"
    );
  }

  return cardId;
}