import { ICard, CategorizedCardsObject } from "src/types";

// const set = new Set<{
//   [key: string]: {
//     cards: Array<ICard>;
//   };
// }>();
// const cardsLength = 5;

// const cards = [
//   { id: 3, frontSideLanguage: "Russian", desc: "im a card" },
//   { id: 1, frontSideLanguage: "Russian", frontSideText: "im a card" },
//   { id: 1, frontSideLanguage: "English", frontSideText: "im a card" },
//   { id: 1, frontSideLanguage: "English", frontSideText: "im a card" },
//   { id: 0, frontSideLanguage: "Russian", desc: "im a card" },
//   { id: 2, frontSideLanguage: "Chinese", frontSideText: "im a card" },
//   { id: 0, frontSideLanguage: "Russian", desc: "im a card" },
//   { id: 1, frontSideLanguage: "Russian", frontSideText: "im a card" },
// ] as Array<ICard>;

export function createCategorizedCardsObject(
  cards: Array<ICard>
): CategorizedCardsObject {
  let categorizedCardMap = {} as CategorizedCardsObject;
  console.log("keys of smoe obj", Object.keys(categorizedCardMap));
  let iterator = 0;
  while (iterator < cards.length) {
    if (cards[iterator].frontSideLanguage) {
      categorizedCardMap = {
        //does current categorizedCardMap hae a key already with the current language category exposed
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
                ...categorizedCardMap[
                  cards[iterator].frontSideLanguage as string
                ].cards,
                cards[iterator],
              ]
            : // and add any new ones that we dont have yet on that category
              [cards[iterator]],
          isActive: false,
          id: iterator.toString(),
        },
      };
      iterator++;
    }
  }
  console.log("some obj", categorizedCardMap);
  console.log("some obj keys now", Object.keys(categorizedCardMap));
  console.log("some obj entries now", Object.entries(categorizedCardMap));
  return categorizedCardMap;
}

//can't have top level await here...
// createCategorizedCardsObject(cards);
