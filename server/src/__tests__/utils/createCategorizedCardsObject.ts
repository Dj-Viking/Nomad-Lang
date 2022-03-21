import { ICard } from "../../types";

export interface CategorizedCardsObject {
  [key: string]: {
    cards: ICard[];
  };
}

export function createCategorizedCardsObject(cards: Array<ICard>): CategorizedCardsObject {
  let categorizedCardMap = {} as CategorizedCardsObject;
  let iterator = 0;
  while (iterator < cards.length) {
    categorizedCardMap = {
      //does current categorizedCardMap have a key already with the current language category exposed
      // inside this for loop right now
      ...categorizedCardMap,
      [`${
        !categorizedCardMap[cards[iterator].frontSideLanguage as string]
          ? cards[iterator].frontSideLanguage
          : cards[iterator].frontSideLanguage
      }`]: {
        // spread the items we already have on that key symbol string of the front side language
        cards: categorizedCardMap[cards[iterator].frontSideLanguage as string]
          ? [
              ...categorizedCardMap[cards[iterator].frontSideLanguage as string].cards,
              cards[iterator],
            ]
          : // and add any new ones that we dont have yet on that category
            [cards[iterator]],
      },
    };
    iterator++;
  }
  // console.log("some obj", categorizedCardMap);
  // console.log("some obj keys now", Object.keys(categorizedCardMap));
  // console.log("some obj entries now", Object.entries(categorizedCardMap));
  return categorizedCardMap;
}
