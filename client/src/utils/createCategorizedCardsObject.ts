import { ICard, CategorizedCardsObject } from "src/types";

export function createCategorizedCardsObject(
    cards: Array<ICard>
): CategorizedCardsObject {
    console.log("what am i sending in here", cards);
    // BUG IN THIS I AM GIVING CARDS ARRAY AS ARRAY OF ID STRINGS OOPS
    let categorizedCardMap = {} as CategorizedCardsObject;
    let iterator = 0;
    while (iterator < cards.length) {
        const fsLang = cards[iterator].frontSideLanguage || "temp";
        categorizedCardMap = {
            //does current categorizedCardMap hae a key already with the current language category exposed
            // inside this for loop right now
            ...categorizedCardMap,
            [fsLang]: {
                // spread the items we already have on that key symbol string of the front side language
                cards: categorizedCardMap[fsLang]
                    ? [
                        ...categorizedCardMap[fsLang].cards,
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
    return categorizedCardMap;
}
