/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  MyRootState,
  CardsState,
  ICard,
  RootCommitType,
  CategorizedCardsObject,
  RootDispatchType,
  Choice,
  EditCardPayload,
} from "@/types";
import { createCategorizedCardsObject } from "@/utils/createCategorizedCardsObject";
import { shuffleCards } from "@/utils/shuffleCards";
import { shuffleArray } from "@/utils/shuffleArray";
import { keyGen } from "../utils/keyGen";
import { ActionContext } from "vuex";
import { createCardChoices } from "@/utils/createCardChoices";

const state: CardsState = {
  allCards: [],
  cards: [],
  categorized: {},
};
const mutations = {
  TOGGLE_CARD_SIDE(state: CardsState, id: string): void {
    state.cards = state.cards.map((card) => {
      if (id === card._id) {
        if (card.isFrontSide) {
          return {
            ...card,
            isFrontSide: false,
            isBackSide: true,
          };
        } else {
          return {
            ...card,
            isBackSide: false,
            isFrontSide: true,
          };
        }
      } else
        return {
          ...card,
        };
    });
  },
  SET_CARDS_CHOICES(
    state: CardsState,
    payload: [Choice, Choice, Choice]
  ): void {
    const new_choices = new Array(3).fill(null).map((_, index) => {
      return {
        id: keyGen(),
        text: payload[index].text
      } as Choice;
    });

    state.allCards = shuffleArray([...state.allCards.map(card => {
      return {
        ...card,
        choices: shuffleArray([...new_choices, { id: keyGen(), text: card.backSideText }])
      };
    })]);

    state.cards = shuffleArray([...state.cards.map(card => {
      return {
        ...card,
        choices: shuffleArray([...new_choices, { id: keyGen(), text: card.backSideText }])
      };
    })]);


  },
  SET_CATEGORIZED_CARD_MAP(
    state: CardsState,
    payload: CategorizedCardsObject
  ): void {
    //just update the state asynchronously resolved from the action
    state.categorized = payload; //map should just absorb through the loop
  },
  SHIFT_CARD_NEXT(state: CardsState, id: string): void {
    state.cards = state.cards.filter((card) => card._id !== id);
  },
  SET_ALL_CARDS(state: CardsState, payload: { cards: Array<ICard> }): void {
    const { cards } = payload;
    if (typeof payload !== "object" || payload === null)
      return console.error(
        "payload must be a specific type of object but it was ",
        payload
      );
    state.allCards = shuffleArray(cards.map((card) => {
      return {
        ...card,
        choices: [...createCardChoices(), { text: card.backSideText }] as Choice[],
        isFrontSide: true,
        isBackSide: false,
      };
    }));
  },
  SET_DISPLAY_CARDS(state: CardsState, payload: { cards: Array<ICard> }): void {
    const { cards } = payload;
    if (typeof payload !== "object" || payload === null)
      return console.error(
        "payload must be a specific type of object but it was ",
        payload
      );
    state.cards = shuffleArray(cards.map((card) => {
      return {
        ...card,
        choices: shuffleArray([...createCardChoices(), { text: card.backSideText }]) as Choice[],
        isFrontSide: true,
        isBackSide: false,
      };
    }));
  },
  ADD_CARD(state: CardsState, card: ICard): void {
    if (typeof card !== "object" || card === null)
      return console.error(
        "card must be a specific type of object but it was ",
        card
      );

    const initCard = {
      ...card,
      choices: [...createCardChoices(), { text: card.backSideText }] as Choice[],
      isFrontSide: true,
      isBackSide: false,
    };
    state.cards.unshift(initCard);
    state.allCards.unshift(initCard);
  },
  DELETE_CARD(state: CardsState, id: string): void {
    if (typeof id !== "string" || id === null)
      return console.error("index argument must be a number but it was: ", id);

    //return a filtered array that doesn't have the id passed as an argument
    state.cards = state.cards.filter((card) => card._id !== id);

    //create new all cards array to reference all user's cards
    state.allCards = state.allCards.filter((card) => card._id !== id);
  },
  //only for local state
  // TODO edit a field conditionally depending on the choice of field(s) that were chose to edit
  EDIT_CARD(state: CardsState, payload: EditCardPayload): void {
    const { id, frontSideText, frontSideLanguage, frontSidePicture, backSideLanguage, backSideText, backSidePicture, } = payload.card;
    const { choices } = payload;

    const index = state.cards.findIndex((card) => card._id === id);
    const index_all = state.allCards.findIndex((card) => card._id === id);

    [...Object.keys(payload.card), "choices"].forEach((key): void => {
      if (key !== "id") {
        switch (key) {
          case "choices": {
            state.cards[index].choices = [...choices, { text: backSideText }];
            state.allCards[index_all].choices = [...choices, { text: backSideText }];
          } break;
          case "frontSideText": {
            state.cards[index].frontSideText = frontSideText || state.cards[index].frontSideText;
            state.allCards[index_all].frontSideText = frontSideText || state.cards[index_all].frontSideText;
          } break;
          case "frontSideLanguage": {
            state.cards[index].frontSideLanguage = frontSideLanguage || state.cards[index].frontSideLanguage;
            state.allCards[index_all].frontSideLanguage = frontSideLanguage || state.allCards[index_all].frontSideLanguage;
          } break;
          case "frontSidePicture": {
            state.cards[index].frontSidePicture = frontSidePicture || state.cards[index].frontSidePicture;
            state.allCards[index_all].frontSidePicture = frontSidePicture || state.allCards[index_all].frontSidePicture;
          } break;
          case "backSideLanguage": {
            state.cards[index].backSideLanguage = backSideLanguage || state.cards[index].backSideLanguage;
            state.allCards[index_all].backSideLanguage = backSideLanguage || state.allCards[index_all].backSideLanguage;
          } break;
          case "backSideText": {
            state.cards[index].backSideText = backSideText || state.cards[index].backSideText;
            state.allCards[index_all].backSideText = backSideText || state.allCards[index_all].backSideText;
          } break;
          case "backSidePicture": {
            state.cards[index].backSidePicture = backSidePicture || state.cards[index].backSidePicture;
            state.allCards[index_all].backSidePicture = backSidePicture || state.allCards[index_all].backSidePicture;
          } break;
          default:
            return void 0;
        }
      }
      return void 0;
    });

    state.cards[index].updatedAt = Date.now();
    state.allCards[index_all].updatedAt = Date.now();
  },
};
const actions = {
  async saveChoices() {
    // call own api to update the user's cards to have the choices.
  },
  async addCard(
    { commit }: ActionContext<CardsState, MyRootState>,
    card: ICard
  ): Promise<void | boolean> {
    if (typeof card !== "object" || card === null)
      return console.error(
        "card must be a specific type of object but it was ",
        card
      );
    try {
      commit("cards/ADD_CARD" as RootCommitType, card, { root: true });
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  },
  async setCards(
    { state, dispatch, commit }: ActionContext<CardsState, MyRootState>,
    payload: CardsState & { choices: Choice[] }
  ): Promise<void | boolean> {
    const { cards, choices } = payload;

    if (!Array.isArray(cards)) {
      throw {
        error: `cards was not an iteritable type! but was ${cards} as typeof ${typeof cards}`,
      };
    }
    const cardsRef = [...cards];

    const shuffledCards = shuffleCards(cardsRef);

    try {

      commit(
        "cards/SET_ALL_CARDS" as RootCommitType,
        { cards: shuffledCards },
        { root: true }
      );

      commit(
        "cards/SET_DISPLAY_CARDS" as RootCommitType,
        { cards: shuffledCards },
        { root: true }
      );
      // if (choices && !cards[0].choices)
      commit(
        "cards/SET_CARDS_CHOICES" as RootCommitType,
        choices,
        { root: true }
      );

      //after commits are done set the categories
      await dispatch(
        "cards/setCategorizedCards" as RootDispatchType,
        { cards: shuffledCards },
        { root: true }
      );

      window.localStorage.setItem("cards", JSON.stringify(state.allCards));
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  },
  async shiftCardNext(
    { commit }: ActionContext<CardsState, MyRootState>,
    id: string
  ): Promise<void> {
    try {
      commit("cards/SHIFT_CARD_NEXT" as RootCommitType, id, { root: true });
      Promise.resolve(true);
    } catch (error) {
      console.error(error as Error);
      Promise.resolve(false);
    }
  },
  async deleteCard(
    { state, commit, dispatch }: ActionContext<CardsState, MyRootState>,
    id: string
  ): Promise<void | boolean> {
    try {
      // this returns new cards arrays for display and the total amount of user's cards
      commit("cards/DELETE_CARD" as RootCommitType, id, { root: true });

      //reset the categorized cards

      await dispatch(
        "cards/setCategorizedCards" as RootDispatchType,
        { cards: [...state.allCards] },
        { root: true }
      );

      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  },
  async editCard(
    { commit, dispatch, state }: ActionContext<CardsState, MyRootState>,
    payload: EditCardPayload
  ): Promise<void | boolean> {
    try {
      commit("cards/EDIT_CARD" as RootCommitType, payload, { root: true });
      await dispatch("cards/setCards" as RootDispatchType, { cards: [...state.allCards], choices: payload.choices }, { root: true });
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  },
  async setCategorizedCards(
    { commit }: ActionContext<CardsState, MyRootState>,
    payload: { cards: ICard[] }
  ): Promise<boolean | Error> {
    try {
      const { cards } = payload;
      //set up the uncategorized map them out of the cards array retturn a new one with cards that do have frontsidelanguage
      const uncategorized = [] as Array<ICard>;
      const toCategorize = [] as Array<ICard>;

      let iter = 0;
      while (iter < cards.length) {
        if (cards[iter].frontSideLanguage === "") {
          uncategorized.unshift(cards[iter]);
        } else
          toCategorize.unshift(cards[iter]);

        iter++;
      }

      //init before falling into the loop where it will change and return as the comit payload
      const returnCategorized = createCategorizedCardsObject(
        toCategorize as ICard[]
      );

      commit(
        "cards/SET_CATEGORIZED_CARD_MAP" as RootCommitType,
        returnCategorized,
        { root: true }
      );

      commit(
        "sidebarCategories/INIT_SIDEBAR_CATEGORIES" as RootCommitType,
        returnCategorized,
        { root: true }
      );
      return Promise.resolve(true);
    } catch (error) {
      console.error(error as Error);
      return Promise.resolve(false);
    }
  },
};
const getters = {
  cards(state: CardsState): ICard[] | [] {
    return state.cards || [];
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
