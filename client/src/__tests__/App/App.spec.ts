/* eslint-disable @typescript-eslint/ban-ts-comment */
import { mount } from "@vue/test-utils";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import App from "../../App.vue";
import BaseLayout from "../../components/BaseLayout.vue";
import Home from "../../views/Home.vue";

const router = createRouterMock({
  initialLocation: "/"
});

router.addRoute("/", {
  path: "/",
  component: Home
});

describe("app mounts", () => {

  beforeEach(() => {
    injectRouterMock(router);
  });

  it("app mounts with mock router and can display what's inside the route we added", async () => {

    const wrapper = mount(App, {
      global: {
        components: {
          "base-layout": BaseLayout
        },
        stubs: {
          RouterView: Home
        }
      }
    });
    // @ts-ignore vue-router-mock has this in docs but gives me error here
    expect(wrapper.router).toBe(router);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain("No Cards Yet");
    expect(wrapper.find('h2.title').text()).toBe("No Cards Yet");
  });
});

describe("snapshot matches", () => {
  it("snapshot matches", () => {
    const wrapper = mount(App, {
      global: {
        components: {
          "base-layout": BaseLayout,
        }
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});

describe("theme changes according to what's in localstorage", () => {
  it("adjusts to light theme from local storage", async () => {
    localStorage.setItem("theme", "light");
    mount(App, {
      global: {
        components: {
          "base-layout": BaseLayout,
        }
      }
    });
  });
  it("adjusts to dark theme from local storage", () => {
    localStorage.setItem("theme", "dark");
    mount(App, {
      global: {
        components: {
          "base-layout": BaseLayout,
        }
      }
    });
  });
});
