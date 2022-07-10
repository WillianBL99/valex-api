import AppError from "../config/error";
import { cardIsValid, findCard } from "./cardService"
import { cardIsUnlocked } from "./rechargeService";

export async function buy( cardId: number ) {
  const card = await findCard( cardId );
  if( !card.password ) {
    throw new AppError(
      "Card is disabled",
      409,
      "Card is disabled",
      "Active card before"
    );
  }
  cardIsValid( card );
  cardIsUnlocked( card );

}