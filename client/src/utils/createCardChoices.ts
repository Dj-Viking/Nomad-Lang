import { shuffleArray } from "./shuffleArray";
export function createCardChoices() {
    return new Array(3).fill(null).map(() => {
        return {
            text: shuffleArray([..."aeiousvk".split("")]).join(""),
        };
    });
}