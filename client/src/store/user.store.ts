import {
  MyRootState,
  UserState,
  ICard,
  RootCommitType,
  SetUserCommitPayload,
} from "@/types";
import { ActionContext } from "vuex";

const state: UserState = {
  user: {
    username: "",
    email: "",
    score: Number(localStorage.getItem("user_score")) || 0,
    token: "",
    cards: [] as ICard[],
    loggedIn: false,
  },
};
const mutations = {
  SET_SCORE(state: UserState, payload: number): void {
    state.user.score += payload;
    let score = Number(localStorage.getItem("user_score")) || 0 as number;
    score += payload;
    const user = {
      username: state.user.username,
      score: score
    };
    localStorage.setItem("user_score", JSON.stringify(user));
  },
  SET_USER(state: UserState, payload: SetUserCommitPayload): void {
    // eslint-disable-next-line
    if (payload && payload.hasOwnProperty("token")) {
      delete payload.token;
    }

    if (typeof payload !== "object")
      return console.error("payload was was not an object!");

    state.user = {
      ...state.user,
      ...payload,
    } as UserState["user"];
  },
  SET_USER_TODOS(state: UserState, payload: ICard[]): void {
    state.user.cards = payload;
  },
  SET_LOGGED_IN(state: UserState, payload: boolean): void {
    state.user = {
      ...state.user,
      loggedIn: payload,
    };
  },
  // eslint-disable-next-line
  CLEAR_USER(state: UserState, payload: any): void {
    state.user = payload;
  },
  CLEAR_USER_TOKEN(state: UserState): void {
    state.user.token = null;
  },
};
const actions = {
  async setUser(
    { commit }: ActionContext<UserState, MyRootState>,
    payload: UserState
  ): Promise<void> {
    try {
      commit("user/SET_USER" as RootCommitType, payload, { root: true });
    } catch (error) {
      console.error(error);
    }
  },
};
const getters = {
  user(state: UserState): UserState["user"] {
    return state.user;
  },
  score(state: UserState): UserState["user"]["score"] {
    return state.user.score;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
