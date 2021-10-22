import { SidebarState } from "@/types";

const state = {
  sidebar: {
    isOpen: false,
  },
};
const mutations = {
  TOGGLE_SIDEBAR(state: SidebarState): void {
    if (state.sidebar.isOpen) {
      state.sidebar.isOpen = false;
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
