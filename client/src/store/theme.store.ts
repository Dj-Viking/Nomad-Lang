import { ThemeState } from "@/types";
const state = {
  theme: "light",
};
const mutations = {
  TOGGLE_THEME(state: ThemeState): void {
    switch (true) {
      case state.theme === "light":
        state.theme = "dark";
        break;
      case state.theme === "dark":
        state.theme = "light";
        break;
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
