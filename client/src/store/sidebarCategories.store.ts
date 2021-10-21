import { SidebarCategorizedCardsState } from "@/types";

const state = {
  categories: {
    ["categoryName"]: {
      id: "0",
      isActive: false,
      cards: [],
    },
  },
} as SidebarCategorizedCardsState;
const mutations = {
  INIT_SIDEBAR_CATEGORIES(
    state: SidebarCategorizedCardsState,
    categories: SidebarCategorizedCardsState["categories"]
  ): void {
    state.categories = categories;
  },
  TOGGLE_ONE_SIDECATEG_ACTIVE(
    state: SidebarCategorizedCardsState,
    payload: { id: string }
  ): void {
    const { id } = payload;

    for (const key in state.categories) {
      if (state.categories[key].id === id) {
        //if the one we clicked was already active deactivate it
        if (state.categories[key].isActive) {
          state.categories[key] = {
            ...state.categories[key],
            isActive: false,
          };
        } else {
          //if it was inactive when we clicked it deactivate it
          state.categories[key] = {
            ...state.categories[key],
            isActive: true,
          };
        }
      } else {
        state.categories[key] = {
          ...state.categories[key],
          isActive: false,
        };
      }
    }
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
