import {
  MyRootState,
  CardsState,
  UserState,
  ICard,
  RootCommitType,
  EditCardCommitPayload,
} from "@/types";
import { ActionContext } from "vuex";

const state: CardsState = {
  cards: [] /*new Array(2).fill(undefined).map((_, index: number) => {
    return {
      id: Date.now() + index, //ids must be unique
      frontSideText: "heres some front side text",
      frontSideLanguage: "heres the front side language",
      frontSidePicture: "gonna be a picture eventually",
      backSideText: "backside text",
      backSideLanguage: "backside Language",
      backSidePicture: "backsidePicture",
      color: "blue",
      creatorId: 69420,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }),*/,
};
const mutations = {
  SET_CARDS(state: CardsState, payload: ICard[]): void {
    if (typeof payload !== "object" || payload === null)
      return console.error(
        "payload must be a specific type of object but it was ",
        payload
      );
    state.cards = payload;
  },
  ADD_CARD(state: CardsState, payload: ICard): void {
    if (typeof payload !== "object" || payload === null)
      return console.error(
        "payload must be a specific type of object but it was ",
        payload
      );
    state.cards.unshift(payload);
  },
  DELETE_CARD(state: CardsState, id: number): void {
    if (typeof id !== "number" || id === null)
      return console.error("index argument must be a number but it was: ", id);

    //return a filtered array that doesn't have the id passed as an argument
    state.cards = state.cards.filter((todo) => todo.id !== id);
  },
  //only for local state
  // TODO edit a field conditionally depending on the choice of field(s) that were chose to edit
  EDIT_CARD(state: CardsState, payload: EditCardCommitPayload): void {
    console.log("payload in edit card store", payload);
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
    const index = state.cards.findIndex((card) => card.id === id);
    //if there are values for each key in the payload then edit those properties on the
    // card we found by the ID passed in from the modal context
    // if the keys dont have values then we wont edit that field on the
    Object.keys(payload).forEach((key): void => {
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

    // state.cards[index].text = text;
    state.cards[index].updatedAt = Date.now();
  },
};
const actions = {
  async addCard(
    { commit }: ActionContext<UserState, MyRootState>,
    payload: ICard
  ): Promise<void | boolean> {
    if (typeof payload !== "object" || payload === null)
      return console.error(
        "payload must be a specific type of object but it was ",
        payload
      );
    try {
      commit("todos/ADD_TODO" as RootCommitType, payload, { root: true });
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  },
  async setCards(
    { commit }: ActionContext<CardsState, MyRootState>,
    payload: CardsState
  ): Promise<void | boolean> {
    try {
      commit("cards/SET_CARDS" as RootCommitType, payload, { root: true });
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  },
  async deleteCard(
    { commit }: ActionContext<CardsState, MyRootState>,
    index: number
  ): Promise<void | boolean> {
    try {
      commit("cards/DELETE_CARD" as RootCommitType, index, { root: true });
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
};
const getters = {
  todos(state: CardsState): ICard[] | [] {
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
