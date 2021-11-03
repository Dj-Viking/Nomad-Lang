"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorizedCardsObject = void 0;
function createCategorizedCardsObject(cards) {
    let categorizedCardMap = {};
    let iterator = 0;
    while (iterator < cards.length) {
        categorizedCardMap = Object.assign(Object.assign({}, categorizedCardMap), { [`${!categorizedCardMap[cards[iterator].frontSideLanguage]
                ? cards[iterator].frontSideLanguage
                : cards[iterator].frontSideLanguage}`]: {
                cards: categorizedCardMap[cards[iterator].frontSideLanguage]
                    ? [
                        ...categorizedCardMap[cards[iterator].frontSideLanguage].cards,
                        cards[iterator],
                    ]
                    :
                        [cards[iterator]],
            } });
        iterator++;
    }
    return categorizedCardMap;
}
exports.createCategorizedCardsObject = createCategorizedCardsObject;
//# sourceMappingURL=createCategorizedCardsObject.js.map