import { createStore, ModuleTree, Store } from "vuex";

import user from "./user.store";
import modal from "./modal.store";
import notification from "./notification.store";
import cards from "./cards.store";
import card from "./card.store";
import sidebarCategories from "./sidebarCategories.store";
import loading from "./loading.store";
import { MyRootState } from "@/types";

const store: Store<MyRootState> = createStore({
  modules: {
    cards,
    card,
    sidebarCategories,
    loading,
    modal,
    notification,
    user,
  } as ModuleTree<MyRootState>,
});

export default store as Store<MyRootState>;
