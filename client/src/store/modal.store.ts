// import { MyRootState, RootCommitType, RootDispatchType } from "@/types";
// import { ActionContext } from "vuex";

import { ActionContext } from "vuex";
import { ModalState, MyRootState, OpenModalPayload, RootCommitType } from "@/types";

const state: ModalState = {
  modal: {
    context: {
      //@ts-expect-error start with empty context
      card: {},
    },
    activeClass: false, //inactive by default
    title: "initial title",
  },
};
const mutations = {
  SET_MODAL_ACTIVE(state: ModalState, payload: boolean): void {
    state.modal.activeClass = payload;
  },
  SET_MODAL_TITLE(state: ModalState, payload: string): void {
    state.modal.title = payload;
  },
  SET_MODAL_CONTEXT(
    state: ModalState,
    payload: ModalState["modal"]["context"]["card"]
  ): void {
    state.modal.context.card = { ...payload };
  },
  CLEAR_MODAL_CONTEXT(state: ModalState): void {
    //@ts-expect-error need to clean up the context
    state.modal.context.card = {};
  },
};
const actions = {
  openModal(
    { commit }: ActionContext<ModalState, MyRootState>,
    payload: OpenModalPayload
  ) {
    const { active, context, title  } = payload;
    commit("modal/SET_MODAL_ACTIVE" as RootCommitType, active, { root: true });
    commit("modal/SET_MODAL_CONTEXT" as RootCommitType, context, { root: true });
    commit("modal/SET_MODAL_TITLE" as RootCommitType, title, { root: true });
  },
};
const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
