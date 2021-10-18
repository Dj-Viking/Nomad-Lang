import { ICard } from "@/types";

// const set = new Set<{
//   [key: string]: {
//     cards: Array<ICard>;
//   };
// }>();
// const cardsLength = 5;

let someObj = {
  ["test"]: {
    cards: [] as ICard[],
  },
} as {
  [key: string]: {
    cards: ICard[];
  };
};

const cards = [
  { id: 3, frontSideLanguage: "Russian", desc: "im a card" },
  { id: 1, frontSideLanguage: "Russian", frontSideText: "im a card" },
  { id: 1, frontSideLanguage: "English", frontSideText: "im a card" },
  { id: 1, frontSideLanguage: "English", frontSideText: "im a card" },
  { id: 0, frontSideLanguage: "Russian", desc: "im a card" },
  { id: 2, frontSideLanguage: "Chinese", frontSideText: "im a card" },
  { id: 0, frontSideLanguage: "Russian", desc: "im a card" },
  { id: 1, frontSideLanguage: "Russian", frontSideText: "im a card" },
] as Array<ICard>;
(function () {
  console.log("keys of smoe obj", Object.keys(someObj));
  for (let iterator = 0; iterator < cards.length; iterator++) {
    someObj = {
      ...someObj,
      [`${
        //does current someObj hae a key already with the current language category
        !someObj[cards[iterator].frontSideLanguage]
          ? cards[iterator].frontSideLanguage
          : cards[iterator].frontSideLanguage
      }`]: {
        cards: someObj[cards[iterator].frontSideLanguage]
          ? [
              ...someObj[cards[iterator].frontSideLanguage].cards,
              cards[iterator],
            ]
          : [cards[iterator]],
      },
    };
  }
  console.log("some obj", someObj);
  console.log("some obj keys now", Object.keys(someObj));
})();
