import { ICard } from "@/types";

export function shuffleCards(cards: ICard[]): ICard[] {
  //must be a copy here... i think its a reference issue??
  let disconnectedCards = [...cards];
  for (let i = disconnectedCards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = disconnectedCards[i];
    disconnectedCards[i] = disconnectedCards[j];
    disconnectedCards[j] = temp;
  }
  return disconnectedCards;
}
