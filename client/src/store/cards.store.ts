/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  MyRootState,
  CardsState,
  ICard,
  RootCommitType,
  EditCardCommitPayload,
  CategorizedCardsObject,
  RootDispatchType,
  Choice,
  CardClass,
} from "@/types";
import { createCategorizedCardsObject } from "@/utils/createCategorizedCardsObject";
import { shuffleArray } from "@/utils/shuffleArray";
import { keyGen } from "../utils/keyGen";
import { ActionContext } from "vuex";

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
    payload: [string, string, string]
  ): void {
    const new_choices = new Array(3).fill(null).map((_, index) => {
      return {
        id: keyGen(),
        text: payload[index]
      } as Choice;
    });

    state.allCards = state.allCards.map(card => {
      return {
        ...card,
        choices: [...new_choices]
      };
    });
    state.cards = state.cards.map(card => {
      return {
        ...card,
        choices: [...new_choices]
      };
    });

    console.log("cards now in mutation", state.cards);

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
    state.allCards = cards.map((card) => {
      return {
        ...card,
        isFrontSide: true,
        isBackSide: false,
      };
    });
  },
  SET_DISPLAY_CARDS(state: CardsState, payload: { cards: Array<ICard> }): void {
    const { cards } = payload;
    if (typeof payload !== "object" || payload === null)
      return console.error(
        "payload must be a specific type of object but it was ",
        payload
      );
    state.cards = cards.map((card) => {
      return {
        ...card,
        isFrontSide: true,
        isBackSide: false,
      };
    });
  },
  ADD_CARD(state: CardsState, card: ICard): void {
    if (typeof card !== "object" || card === null)
      return console.error(
        "card must be a specific type of object but it was ",
        card
      );

    const initCard = {
      ...card,
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
  EDIT_CARD(state: CardsState, payload: EditCardCommitPayload): void {
    const {
      id,
      frontSideText,
      frontSideLanguage,
      frontSidePicture,
      backSideLanguage,
      backSideText,
      backSidePicture,
    } = payload;
    //find the index of the card we want to edit
    const index = state.cards.findIndex((card) => card._id === id);
    //if there are values for each key in the payload then edit those properties on the
    // card we found by the ID passed in from the modal context
    // if the keys dont have values then we wont edit that field on the
    Object.keys(payload).forEach((key): void => {
      // @ts-ignore
      if (key !== "id" && !!payload[key]) {
        switch (key) {
          case "frontSideText":
            state.cards[index].frontSideText = frontSideText;
            break;
          case "frontSideLanguage":
            state.cards[index].frontSideLanguage = frontSideLanguage;
            break;
          case "frontSidePicture":
            state.cards[index].frontSidePicture = frontSidePicture;
            break;
          case "backSideLanguage":
            state.cards[index].backSideLanguage = backSideLanguage;
            break;
          case "backSideText":
            state.cards[index].backSideText = backSideText;
            break;
          case "backSidePicture":
            state.cards[index].backSidePicture = backSidePicture;
            break;
          default:
            return void 0;
        }
      }
      return void 0;
    });

    state.cards[index].updatedAt = Date.now();
  },
};
const actions = {
  async getCardsChoices(context: ActionContext<CardsState, MyRootState>, payload: { id: string }): Promise<Choice[]> {
    //
    let choices = [] as Choice[];
    const { id } = payload;
    console.log("got id of card", id);


    choices = state.cards.map((card: CardClass, index: number, _cards: Array<CardClass>) => {
      return _cards[index].choices![index];
    });

    console.log("choices in vuex", choices);

    return Promise.resolve(choices);

  },
  async getFakeChoices(

    { commit, dispatch }: ActionContext<CardsState, MyRootState>,
    // eslint-disable-next-line
    isInDb: boolean
  ): Promise<void> { //commit new set of cards with updated fake choices until they are changed by user.
    try {
      const category = "dev";
      //fetch chuck norris api
      const responses: Array<Promise<Response>> = new Array(3).fill(null).map(async (): Promise<Response> => {
        return fetch(`https://api.chucknorris.io/jokes/random?category=${category}`, { method: "GET" });
      });

      const rezzed: Array<Response> = await Promise.all(responses);

      const data_promises: Array<Promise<any>> = new Array(3).fill(null).map(async (_, index) => {
        return rezzed[index].json();
      });

      const datas = await Promise.all(data_promises);
      console.log("all datas", datas);


      const jokes = datas.map(data => {

        let new_data;

        //scramble the string around
        new_data = data.value.split("").map((char: string, index: number, arr: string[]) => {
          return arr[Math.ceil(Math.random() * arr.length)];
        });

        // let other_data = [new_data.split(" ")];

        return new_data.join("").slice(0, 7);
      });
      //commit the jokes into the cards array state
      // set new cards with the backside text as one of the choices (correct answer)
      // place the remaining three choices into the card's choices array
      console.log("jokes", jokes);

      const choices = [...jokes];

      if (!isInDb) {
        await dispatch("cards/saveChoices" as RootDispatchType, choices, { root: true });
      }

      commit("SET_CARDS_CHOICES", choices);
      return Promise.resolve();

    } catch (error) {
      console.error("error during getting fake choices from chuck norris api", error);
      return Promise.reject();
    }
  },
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
    payload: CardsState
  ): Promise<void | boolean> {
    const { cards } = payload;
    if (!Array.isArray(cards)) {
      throw {
        error: `cards was not an iteritable type! but was ${cards} as typeof ${typeof cards}`,
      };
    }
    const cardsRef = [...cards];

    const shuffledCards = shuffleArray(cardsRef);

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
      await dispatch("cards/getFakeChoices" as RootDispatchType, null, { root: true });
      //after commits are done set the categories
      await dispatch(
        "cards/setCategorizedCards" as RootDispatchType,
        { cards: state.allCards },
        { root: true }
      );
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
        { cards: state.allCards },
        { root: true }
      );

      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  },
  async editCard(
    { commit }: ActionContext<CardsState, MyRootState>,
    payload: { index: number; text: string }
  ): Promise<void | boolean> {
    try {
      commit("cards/EDIT_CARD" as RootCommitType, payload, { root: true });

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
      // taking in the cards array and sorting the categories by creating an object
      // that has a key that is dynamic which will be this meta-list of categories
      // because trying to do this with type-graphql typeorm was very strange and
      // probably nobody is trying to do that sort of thing right now....
      // create a new cards Object to return that contains the cards categorized by their frontside language

      //set up the uncategorized map them out of the cards array retturn a new one with cards that do have frontsidelanguage
      const uncategorized = [] as Array<ICard>;
      const toCategorize = [] as Array<ICard>;

      let iter = 0;
      while (iter < cards.length) {
        if (cards[iter].frontSideLanguage === "") {
          uncategorized.unshift(cards[iter]);
        }
        if (cards[iter].frontSideLanguage !== "") {
          toCategorize.unshift(cards[iter]);
        }
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
