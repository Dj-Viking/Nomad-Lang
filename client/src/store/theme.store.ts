/* eslint-disable */ 
import { ThemeState } from "@/types";
const state = {
  theme: window.localStorage.getItem("theme") || "light",
};
const mutations = {
  SET_THEME(state: ThemeState, theme: string): void {
    if (typeof theme !== "string")
      return console.error("set theme commit payload must be a string!");
    state.theme = theme;
  },
  TOGGLE_THEME(state: ThemeState): void {
    switch (true) {
      case state.theme === "light":
        {
          window.localStorage.setItem("theme", "dark");
          state.theme = "dark";

          document.querySelector("html")!.style.transition = "0.5s";
          document.querySelector("html")!.style.backgroundColor = "#222222";
          document.body.classList.remove("body-light");
          document.body.classList.add("body-dark");
        }
        break;
      case state.theme === "dark":
        window.localStorage.setItem("theme", "light");
        state.theme = "light";

        document.querySelector("html")!.style.transition = "0.5s";
        document.querySelector("html")!.style.backgroundColor = "white";
        document.body.classList.remove("body-dark");
        document.body.classList.add("body-light");
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
