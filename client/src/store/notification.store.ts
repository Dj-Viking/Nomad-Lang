// import {
//   MyRootState,
//   RootCommitType,
//   RootDispatchType
// } from "@/types";
// import { ActionContext } from "vuex";

import { NotificationState, OpenNotificationPayload } from "@/types";

const state: NotificationState = {
  notification: {
    type: "",
    message: "",
    toastDown: false,
    toastUp: false,
  },
};
const mutations = {
  OPEN_NOTIFICATION(
    state: NotificationState,
    payload: OpenNotificationPayload
  ): void {
    state.notification = {
      ...state.notification,
      ...payload.notification,
      toastDown: true,
      toastUp: false,
    };
  },
  CLOSE_NOTIFICATION(state: NotificationState): void {
    state.notification = {
      ...state.notification,
      toastDown: false,
      toastUp: true,
    };

    //wait until almost the end of the animation to remove the type and the message and set both classes false
    setTimeout(() => {
      console.log("deleting type and message in close");
      state.notification.type = "";
      state.notification.message = "";
      state.notification.toastUp = false;
      state.notification.toastDown = false;
    }, 300);
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
