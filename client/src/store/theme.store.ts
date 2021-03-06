import { ThemeState } from "@/types";
const state = {
  theme: window.localStorage.getItem("theme") || "light",
};
const mutations = {
  SET_THEME(state: ThemeState, theme: string): void {
    if (typeof theme !== "string") state.theme = "light";
    state.theme = theme;
    switch (true) {
      case theme === "dark":
        {
          window.localStorage.setItem("theme", "dark");

          // eslint-disable-next-line
          document.querySelector("html")!.style.transition = "0.5s";
          // eslint-disable-next-line
          document.querySelector("html")!.style.backgroundColor = "#222222";
          document.body.classList.remove("body-light");
          document.body.classList.add("body-dark");
        }
        break;
      case theme === "light":
        {
          window.localStorage.setItem("theme", "light");

          // eslint-disable-next-line
          document.querySelector("html")!.style.transition = "0.5s";
          // eslint-disable-next-line
          document.querySelector("html")!.style.backgroundColor = "white";
          document.body.classList.remove("body-dark");
          document.body.classList.add("body-light");
        }
        break;
    }
  },
  TOGGLE_THEME(state: ThemeState): void {
    switch (true) {
      case state.theme === "light":
        {
          window.localStorage.setItem("theme", "dark");
          state.theme = "dark";

          // eslint-disable-next-line
          document.querySelector("html")!.style.transition = "0.5s";
          // eslint-disable-next-line
          document.querySelector("html")!.style.backgroundColor = "#222222";
          document.body.classList.remove("body-light");
          document.body.classList.add("body-dark");
        }
        break;
      case state.theme === "dark":
        {
          window.localStorage.setItem("theme", "light");
          state.theme = "light";

          // eslint-disable-next-line
          document.querySelector("html")!.style.transition = "0.5s";
          // eslint-disable-next-line
          document.querySelector("html")!.style.backgroundColor = "white";
          document.body.classList.remove("body-dark");
          document.body.classList.add("body-light");
        }
        break;
    }
  },
};
const actions = {};
const getters = {
  isLight(state: ThemeState) {
    return state.theme === "light";
  },
  isDark(state: ThemeState) {
    return state.theme === "dark";
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
