import { shallowMount } from "@vue/test-utils";
import App from "../../App.vue";

describe("app mounts", () => {
  it("app mounts and wrapper exists", () => {
    const wrapper = shallowMount(App);
    expect(wrapper.exists()).toBe(true);
  });
});

describe("snapshot matches", () => {
  it("snapshot matches", () => {
    const wrapper = shallowMount(App);
    expect(wrapper.element).toMatchSnapshot();
  });
});
