"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorizedCardsObject = void 0;
function createCategorizedCardsObject(cards) {
    let categorizedCardMap = {};
    let iterator = 0;
    while (iterator < cards.length) {
        categorizedCardMap = Object.assign(Object.assign({}, categorizedCardMap), { [`${!categorizedCardMap[cards[iterator].frontsideLanguage]
                ? cards[iterator].frontsideLanguage
                : cards[iterator].frontsideLanguage}`]: {
                cards: categorizedCardMap[cards[iterator].frontsideLanguage]
                    ? [
                        ...categorizedCardMap[cards[iterator].frontsideLanguage].cards,
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