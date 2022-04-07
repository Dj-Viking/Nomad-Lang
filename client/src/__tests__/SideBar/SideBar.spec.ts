/* eslint-disable @typescript-eslint/ban-ts-comment */
import { mount } from "@vue/test-utils";
import SideBar from "../../components/SideBar.vue";
import { createRouterMock, injectRouterMock } from "vue-router-mock";

const router = createRouterMock({
  initialLocation: "/"
});
const searchTermElCbs = {} as Record<any, any>;
const documentElCbs = {} as Record<any, any>;

const blurHandler = function (event: keyof GlobalEventHandlersEventMap, cb: () => void): void { 
  searchTermElCbs[event] = cb;
};
const keydownHandler = function (event: keyof GlobalEventHandlersEventMap, cb: () => void): void {
  documentElCbs[event] = cb;
};
const searchTermElMock = { 
  addEventListener: jest.fn(blurHandler)
};
const iconElMock = {
  addEventListener: jest.fn(keydownHandler)
};

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

//@ts-ignore
// jest.spyOn(document, 'querySelector').mockImplementation(() => searchTermElMock);

const querySelectorSpy = jest.spyOn(document, 'querySelector');
//@ts-ignore
querySelectorSpy.mockImplementationOnce(() => searchTermElMock);

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

    // keydown does work, I just have to use several event directives on the element
    // need to probably add multiple events onto an element some way that vue allows this to happen
    wrapper.find("i.fa").trigger("keydown", { key: "c" });

    expect(wrapper.find("div.side-bar").classes()).toContain("open");

    //type in sidebar search to cover the if statement when opening the sidebar 
    // which sets the text empty string if the self.searchTerm was not empty string
  });



  // TODO: if going to test the search term inside the sidebar, should add a card first
});
