import { LoadingState } from "@/types";

const state = {
  loading: {
    isLoading: true,
  },
} as LoadingState;
const mutations = {
  SET_LOADING(state: LoadingState, payload: boolean): void {
    state.loading.isLoading = payload;
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
