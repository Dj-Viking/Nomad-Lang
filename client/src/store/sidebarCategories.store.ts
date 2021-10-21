import { SidebarCategorizedCardsState } from "@/types";

const state = {
  categories: {
    ["categoryName"]: {
      id: 0,
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
  SET_ONE_SIDECATEG_ACTIVE(
    state: SidebarCategorizedCardsState,
    payload: { id: number }
  ): void {
    const { id } = payload;
    console.log("what is id passed in ", id);
    // let tempObj = {} as keyof SidebarCategorizedCardsState["categories"];
    for (const key in state.categories) {
      console.log("whta is each thing ", state.categories[key]);

      // tempObj = { ...state.categories[key] };

      console.log(
        "id matched the category we clicked",
        state.categories[key].id === id
      );
      if (state.categories[key].id === id) {
        //if the one we clicked was already active deactivate it
        if (state.categories[key].isActive) {
          state.categories[key] = {
            ...state.categories[key],
            isActive: false,
          };
        } else {
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
