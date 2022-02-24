import { createApp, h } from "vue";
import App from "./App.vue";
import BaseLayout from "./components/BaseLayout.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
// Import the CSS or use your own!

// import BootstrapVue3 from "bootstrap-vue-3";

// Optional, since every component import their Bootstrap funcionality
// the following line is not necessary
// import 'bootstrap'

// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "./myscss/myscss.scss";

//create app
const app = createApp({
  render: () => h(App),
})
  .use(store)
  .use(router)
  .use(Toast);
// .use(BootstrapVue3);

app.component("base-layout", BaseLayout);

router.isReady().then(() => {
  app.mount("#app");
});
