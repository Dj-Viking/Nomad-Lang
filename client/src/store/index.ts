import { createStore, ModuleTree, Store } from "vuex";

import user from "./user.store";
import modal from "./modal.store";
import notification from "./notification.store";
import cards from "./cards.store";
import { MyRootState } from "@/types";

const store: Store<MyRootState> = createStore({
  modules: {
    cards,
    modal,
    notification,
    user,
  } as ModuleTree<MyRootState>,
});

export default store as Store<MyRootState>;
