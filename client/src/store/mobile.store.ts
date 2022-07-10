import {
    MobileState,
} from "@/types";

  const state = {
    mobile: {
        isMobile: false
    }
  };
  const mutations = {
    TOGGLE_ISMOBILE(state: MobileState, payload: number): void {
        if (typeof payload === "boolean") {
            state.mobile.isMobile = payload;
            console.log("state.mobile", state.mobile);
        }
        if (typeof payload === "number") {
            if (payload <= 600) {
                state.mobile.isMobile = true;
                console.log("state.mobile", state.mobile);
            } else {
                console.log("state.mobile", state.mobile);
                state.mobile.isMobile = false;
            }
        }
    },
  };
  const actions = {};
  const getters = {
    isMobile(state: MobileState): boolean {
      return state.mobile.isMobile;
    },
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };
  