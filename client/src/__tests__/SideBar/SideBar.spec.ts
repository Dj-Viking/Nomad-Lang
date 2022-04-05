import { routes } from "@/router";
import { shallowMount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import SideBar from "../../components/SideBar.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});


describe("opens sidebar", () => {
  it("opens sidebar with c key pressed", async () => {
    const wrapper = shallowMount(SideBar, {
      global: {
        plugins: [router]
      }
    });
    // simulate keypress on document
    wrapper.trigger("keyup", { key: "c" });
  });
});
