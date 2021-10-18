import { ICard } from "@/types";

export class CategorizedCardMapClass extends Map {
  private categorizedMap!: Map<ICard["id"], string>;
  constructor() {
    super();
    this.categorizedMap = new Map();
  }

  public clearSelf(): void {
    Object.keys(this.categorizedMap).map((key) => {
      delete this.categorizedMap[key];
    });
  }
  public printMe(): void {
    console.log("from print me what am i doing", this.categorizedMap.values());
  }
  public printMyKeyValues(): Array<string[]> {
    return Object.entries(this.categorizedMap);
  }
}

(function () {
  const categorized = new Map();
  let Russian = {
    1: {
      ["Russian"]: ["russian card"],
    },
  };
  const newData = {
    0: {
      ["English"]: ["card object"],
    },
  };
  const cards = [{ ...newData }, { ...Russian }];
  console.log("what is cards", cards);
  console.log("some categorized map initted", categorized);
  const map = new CategorizedCardMapClass();
  //keyed on the id
  categorized.set(newData[0], {
    [Number(
      `${Object.keys(newData).filter((key) => typeof key === "number")[0]}`
    )]: newData[0].English,
  });
  categorized.set(Russian[1], {
    [Object.keys(Russian).filter((key) => typeof key === "number")[0]]:
      newData[0],
  });

  for (let i = 0; i < cards.length; i++) {
    categorized.set(cards, cards[i]);
  }
  categorized.set(
    Object.keys(Russian).filter((key) => /Russian/g.test(key))[0],
    Russian
  );
  console.log(
    "is instance of Cat card map",
    map instanceof CategorizedCardMapClass
  );
  if (map instanceof CategorizedCardMapClass) {
    console.log("getting english keyed object", map.get("English"));
    console.log(map.get("Russian"));
  }
})();
