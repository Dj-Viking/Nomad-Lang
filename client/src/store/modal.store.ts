// import { MyRootState, RootCommitType, RootDispatchType } from "@/types";
// import { ActionContext } from "vuex";

import { ModalState } from "../../src/types";

const state: ModalState = {
  modal: {
    context: {
      card: {},
    },
    activeClass: false, //inactive by default
    title: "initiall title",
  },
};
const mutations = {
  SET_MODAL_ACTIVE(state: ModalState, payload: boolean): void {
    console.log("calling vuex open modal active commit", payload);
    state.modal.activeClass = payload;
  },
  SET_MODAL_TITLE(state: ModalState, payload: string): void {
    state.modal.title = payload;
  },
  SET_MODAL_CONTEXT(
    state: ModalState,
    payload: ModalState["modal"]["context"]["card"]
  ): void {
    state.modal.context.card = payload;
  },
  CLEAR_MODAL_CONTEXT(state: ModalState): void {
    state.modal.context.card = {};
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
