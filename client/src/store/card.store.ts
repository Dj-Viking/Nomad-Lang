import { CardState } from "@/types";

const state = {
  card: {
    id: "",
    isFrontSide: true,
    isBackSide: false,
  },
} as CardState;
const mutations = {
  CARD_SIDE_FRONT(
    state: CardState,
    payload: { isFrontSide: true; isBackSide: false }
  ): void {
    const { isFrontSide, isBackSide } = payload;
    state.card = {
      ...state.card,
      isFrontSide,
      isBackSide,
    };
  },
  CARD_SIDE_BACK(
    state: CardState,
    payload: { isFrontSide: false; isBackSide: true }
  ): void {
    const { isFrontSide, isBackSide } = payload;
    state.card = {
      ...state.card,
      isFrontSide,
      isBackSide,
    };
  },
};
const actions = {};
const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
