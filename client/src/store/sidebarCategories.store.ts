import {
  ICard,
  MyRootState,
  RootCommitType,
  SidebarCategorizedCardsState,
} from "@/types";
import { ActionContext } from "vuex";

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
          //if it was inactive when we clicked it activate it
          state.categories[key] = {
            ...state.categories[key],
            isActive: true,
          };
        }
      } else {
        //any other categories just set inactive
        state.categories[key] = {
          ...state.categories[key],
          isActive: false,
        };
      }
    }
  },
};
const actions = {
  async toggleWithOneKey(
    {
      state,
      rootState,
      commit,
    }: ActionContext<SidebarCategorizedCardsState, MyRootState>,
    payload: { categoryName: string }
  ): Promise<void | boolean> {
    try {
      const { categoryName } = payload;

      let totalInactive = 0;
      let totalActive = 0;
      let wasActive = [] as Array<string>;
      for (const key in state.categories) {
        state.categories[key].isActive === true && wasActive.push(key);
        state.categories[key].isActive === true && totalActive++;
        state.categories[key].isActive === false && totalInactive++;
      }
      for (const key in state.categories) {
        //set everything inactive
        state.categories[key] = {
          ...state.categories[key],
          isActive: false,
        };
      }
      // console.log("category that was active", wasActive);
      // console.log("total inactive once 1 key pressed", totalInactive);
      // console.log("total active once 1 key pressed", totalActive);

      switch (true) {
        case wasActive.length > 0 &&
          !wasActive.includes(categoryName) &&
          totalActive === 1 &&
          totalInactive >= 1: {
          state.categories[categoryName] = {
            ...state.categories[categoryName],
            isActive: true,
          };
          commit(
            "cards/SET_DISPLAY_CARDS" as RootCommitType,
            { cards: state.categories[categoryName].cards },
            { root: true }
          );
          return;
        }
        case wasActive.length === 0 &&
          totalActive === 0 &&
          totalInactive >= 1: {
          state.categories[categoryName] = {
            ...state.categories[categoryName],
            isActive: true,
          };
          commit(
            "cards/SET_DISPLAY_CARDS" as RootCommitType,
            { cards: state.categories[categoryName].cards },
            { root: true }
          );
          return;
        }
        case wasActive.includes(categoryName) &&
          totalActive === 1 &&
          totalInactive >= 1: {
          state.categories[categoryName] = {
            ...state.categories[categoryName],
            isActive: false,
          };
          commit(
            "cards/SET_DISPLAY_CARDS" as RootCommitType,
            { cards: rootState.cards.allCards },
            { root: true }
          );
          return;
        }
      }
      return Promise.resolve(true);
    } catch (error) {
      console.error("error when toggling with one key", error as Error);
      return Promise.resolve(false);
    }
  },
};
const getters = {
  aCategoryIsActive(state: SidebarCategorizedCardsState): boolean {
    let activeAmount = 0;
    for (const key in state.categories) {
      if (state.categories[key].isActive) activeAmount++;
    }
    if (activeAmount > 0) return true;
    return false;
  },
  currentActiveCategoryCards(
    state: SidebarCategorizedCardsState
  ): ICard[] | void {
    for (const key in state.categories) {
      if (state.categories[key].isActive) return state.categories[key].cards;
    }
    return void 0;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
