import { SidebarState } from "@/types";

const state = {
  sidebar: {
    searchTerm: "",
    isOpen: false,
  },
};
const mutations = {
  TOGGLE_SIDEBAR(state: SidebarState): void {
    if (state.sidebar.isOpen) {
      state.sidebar.isOpen = false;
      document
        .querySelector("input#iamsearch")
        ?.removeEventListener("blur", () => {
          return void 0;
        });
    } else {
      state.sidebar.isOpen = true;
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
