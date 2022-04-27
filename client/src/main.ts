import { createApp, h } from "vue";
import App from "./App.vue";
import BaseLayout from "./components/BaseLayout.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./myscss/myscss.scss";

//create app
const app = createApp({
  render: () => h(App),
})
  .use(store)
  .use(router)
  .use(Toast)
  .component("base-layout", BaseLayout);
  
router.isReady().then(() => {
  app.mount("#app");
});
