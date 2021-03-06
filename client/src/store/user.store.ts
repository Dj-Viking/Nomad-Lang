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
    score: 0,
    answers: {
      correct: 0,
      incorrect: 0,
    },
    token: "",
    cards: [] as ICard[],
    loggedIn: false,
  },
};
const mutations = {
  SAVE_SCORE(state: UserState, payload: { correct: number, incorrect: number }): void {
    let { correct, incorrect } = payload;
    let score = 0;
    for (let i = 0; i < correct; i++) score += 5;
    for (let i = 0; i < incorrect; i++) score -= 5;
    const user = {
      username: state.user.username,
      date: Date.now(),
      score: score
    };
    localStorage.setItem("user_score", JSON.stringify(user));
  },
  RESET_ANSWERS(state: UserState): void {
    state.user.answers.correct = 0;
    state.user.answers.incorrect = 0;
  },
  INCREMENT_CORRECT(state: UserState): void {
    state.user.answers.correct += 1;
  },
  INCREMENT_INCORRECT(state: UserState): void {
    state.user.answers.incorrect += 1;
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
  SET_USER_CARDS(state: UserState, payload: ICard[]): void {
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
  correct(state: UserState): UserState["user"]["answers"]["correct"] {
    return state.user.answers.correct;
  },
  incorrect(state: UserState): UserState["user"]["answers"]["incorrect"] {
    return state.user.answers.incorrect;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
