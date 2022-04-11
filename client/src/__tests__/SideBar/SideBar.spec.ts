/* eslint-disable @typescript-eslint/ban-ts-comment */
import { mount } from "@vue/test-utils";
import SideBar from "../../components/SideBar.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";
import App from "../../App.vue";
import Home from "../../views/Home.vue";
import BaseLayout from "../../components/BaseLayout.vue";

const router = createRouterMock({
  initialLocation: "/"
});
// this is to help with any routes that may be navigated to
// during the course of a mount during a test suite
router.addRoute("/", {
  path: "/",
  component: Home
});

const searchTermElCbs = {} as Record<any, any>;
// const bodyElCbs = {} as Record<any, any>;

const blurHandler = function (event: keyof GlobalEventHandlersEventMap, cb: () => void): void { 
  searchTermElCbs[event] = cb;
};
// const keydownHandler = function (event: keyof GlobalEventHandlersEventMap, cb: () => void): void {
//   bodyElCbs[event] = cb;
// };
const searchTermElMock = { 
  addEventListener: jest.fn(blurHandler)
};
// const bodyElMock = {
//   addEventListener: jest.fn(keydownHandler)
// };

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

//@ts-ignore
// jest.spyOn(document, 'querySelector').mockImplementation(() => searchTermElMock);

const querySelectorSpy = jest.spyOn(document, 'querySelector');
//@ts-ignore
querySelectorSpy
// .mockImplementationOnce(() => bodyElMock)
//@ts-ignore
                .mockImplementationOnce(() => searchTermElMock);
describe("opens sidebar", () => {

  beforeEach(() => {
    injectRouterMock(router);
  });

  it("opens sidebar when clicking the chevron right icon", async () => {
    const wrapper = mount(SideBar, {});
    // simulate keypress to open the sidebar
    wrapper.find("i.fa").trigger("click");
    jest.runAllTimers();
    expect(searchTermElMock.addEventListener).toHaveBeenCalledTimes(1);
    // @ts-ignore
    const blurHandler = searchTermElMock.addEventListener.mock.calls[0][1];
    blurHandler();
    expect(searchTermElMock.addEventListener).toBeCalledWith("blur", expect.any(Function));
    expect(setTimeout).toHaveBeenCalledTimes(2);

    //the sidebar is still closed during this test block
  });
  
  it("opens sidebar when pressing c key", async () => {
    // sidebar becomes open during this test block
    const wrapper = mount(SideBar, {});

    // keydown does work, several event directives doesn't work with
    // object syntax for some reason `v-on="{'click': handler, 'keydown': otherHandler }" won't work

    expect(wrapper.find("div.side-bar").classes()).toContain("open");

    //type in sidebar search to cover the if statement when opening the sidebar 
    // which sets the text empty string if the self.searchTerm was not empty string
  });



  // TODO: if going to test the search term inside the sidebar, should add a card first
  it("adds a card so that we can search in the sidebar", () => {
    const wrapper = mount(App, {
      global: {
        components: {
          "base-layout": BaseLayout
        },
        stubs: {
          RouterView: Home
        }
      },
    });
    expect(wrapper.html()).toContain("No Cards Yet");
    expect(wrapper.find('h2.title').text()).toBe("No Cards Yet");

    // something wrong with store injection might have to mock the vuex store I think....
    wrapper.find("button#add-button").trigger("click");
  });
});
