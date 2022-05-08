
<template>
  <div
    class="side-bar"
    :class="{ open: sidebarOpen, closed: !sidebarOpen }"
  >
    <div style="display: flex; flex-direction: column; min-width: 100px">
      <Transition
        type="transition"
        name="fade"
        mode="out-in"
      >
        <div v-if="sidebarOpen">
          <div style="
              display: flex;
              justify-content: center;
              flex-direction: column;
            ">
            <div
              style="margin: 0 auto;"
              :class="{ 'show-me': sidebarOpen, 'hide-me': !sidebarOpen }"
            >
              <ToggleButton />
            </div>
            <i
              v-on="{ click: toggleSideBar }"
              style="
                cursor: pointer;
                margin-top: 0.5em;
                margin-left: 0.5em;
                margin-right: 0.5em;
                margin-bottom: 0.5em;
              "
              :class="{
                'fa fa-chevron-left big-light': sidebarOpen,
                'fa fa-chevron-right big': !sidebarOpen,
              }"
              aria-hidden="true"
            ></i>

            <input
              placeholder="Search"
              class="input"
              style="width: 80%; margin: 0 auto;"
              type="text"
              autocomplete="off"
              id="iamsearch"
              v-model="searchTerm"
              @input.prevent="search"
              name="searchTerm"
            />

            <h4
              style="
                font-size: 15px;
                margin: 1em auto 1em auto;
                height: 30px;
              "
              class="title"
            >
              Your Categories
            </h4>
          </div>
          <div id="cards-container">
            <div
              v-for="(key, i) of Object.keys(categories)"
              :key="i"
            >
              <span :id="
                !!categories[key] &&
                categories[key].cards[0]?.frontSideLanguage
              ">{{ i + 1 }}.&nbsp;</span>
              <SideBarNode
                :id="categories[key].id?.toString()"
                :isActive="categories[key].isActive"
                :categoryName="key"
                :categories="categories"
                :categorizedCards="categories[key].cards"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div style="display: flex; flex-direction: column; margin-left: 15px; margin-right: 15px;">
            <div :class="{ 'show-me': !sidebarOpen, 'hide-me': sidebarOpen }">
              <ToggleButton />
            </div>

            <i
              v-on="{ click: toggleSideBar }"
              style="
                cursor: pointer;
                margin-top: 0.5em;
                margin-left: 0.5em;
                margin-right: 0.5em;
              "
              class="hide-sidebar-toggle-mobile"
              :class="{
                'fa fa-chevron-left big': sidebarOpen,
                'fa fa-chevron-right big-dark': !sidebarOpen && isDark,
                'fa fa-chevron-right big-light': !sidebarOpen && isLight,
              }"
              aria-hidden="true"
            ></i>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import store from "@/store";
import {
  ICard,
  MyRootState,
  RootCommitType,
  RootDispatchType,
} from "@/types";
import { escapeRegexp } from "@/utils/escapeRegexp";
import SideBarNode from "./SideBarNode.vue";
import { defineComponent, ref, computed } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import ToggleButton from "../components/ToggleButton.vue";
import { createHighlightedCardTextHtml } from "@/utils/createHighlightedCardTextHtml";
import { useStore } from "vuex";
export default defineComponent({
  name: "SideBar",
  components: {
    SideBarNode,
    ToggleButton,
  },
  setup() {
    const route = useRoute();
    const store = useStore<MyRootState>();
    const searchTerm = ref("");
    const isLight = computed(() => store.state.theme.theme === "light");
    const isDark = computed(() => store.state.theme.theme === "dark");
    const allCards = computed(() => store.state.cards.allCards);
    const cards = computed(() => store.state.cards.cards);
    const categories = computed(() => store.state.cards.categorized);
    const sidebarOpen = computed(() => store.state.sidebar.sidebar.isOpen);
    const modalActive = computed(() => store.state.modal.modal.activeClass);
    return {
      route,
      searchTerm,
      isLight,
      isDark,
      allCards,
      cards,
      categories,
      sidebarOpen,
      modalActive
    };
  },
  methods: {
    search(event: any): void {
      const input = event.target.value as string;
      const searchRegex = new RegExp(`(${escapeRegexp(input)})+`, "g");

      //set categories that match the content of the cards in the array

      //create the frontside text content to be the html that will be
      // injected with v-html in the spans
      // stored inside the card's frontside text content

      // the content string will be the entire string stored in frontside text
      const content = (() => {
        let str = "";
        for (const card of this.allCards) {
          if (searchRegex.test(card.frontSideText as string)) {
            str = card.frontSideText as string;
          }
        }
        if (str) return str;
        else return "";
      })();

      const html = createHighlightedCardTextHtml(
        input,
        content as string,
        searchRegex
      );

      if (
        html.split("strong>")[1] &&
        html.split("strong>")[1].replace("</", "").length
      ) {
        let matchedCards: Array<ICard> = [];
        for (const card of this.allCards) {
          if (content === (card.frontSideText as string)) {
            matchedCards.push({
              ...card,
              frontSideText: html,
            });
          }
        }

        store.commit("cards/SET_DISPLAY_CARDS" as RootCommitType, {
          cards: matchedCards,
        });
      } else {
        store.commit(
          "cards/SET_DISPLAY_CARDS" as RootCommitType,
          { cards: this.allCards },
          { root: true }
        );
      }

      return void 0;
    },
    toggleSideBar(_event: MouseEvent): void {
      _event.preventDefault();
      this.searchTerm = "";
      let searchTermEl: HTMLElement | null = null;

      setTimeout(() => {
        searchTermEl = document.querySelector(`input#iamsearch`);
      }, 1200);

      const self = this;

      (async function (ms: number): Promise<void> {
        return new Promise(function (resolve) {
          setTimeout(function () {
            if (searchTermEl !== null) {
              searchTermEl.addEventListener("blur", () => {
                if (self.searchTerm !== "") {
                  self.searchTerm = "";
                } else return void 0;
              });
            }
            resolve();
          }, ms);
        });
      })(1300);

      store.commit(
        "sidebar/TOGGLE_SIDEBAR" as RootCommitType,
        {},
        { root: true }
      );
    },

    listenOnKeyDown(event: any): void {
      event.preventDefault();
      switch (true) {
        case event.key === "c" || event.key === "C":
          {
            const translationInputEl = document.querySelector("input#translation-input");
            const currentFocusedEl = document.activeElement;

            // if input is focused and c key was pushed don't open the sidebar
            if (translationInputEl?.nodeName === currentFocusedEl?.nodeName) return;

            // if searchTerm has text such as c key or modal is active don't open sidebar
            if (!!this.searchTerm || this.modalActive) return;

            // otherwise open side bar when c key was pressed on the keyboard
            this.toggleSideBarWithC(event);
          }
          break;
        case event.key === "1":
          {
            if (this.modalActive) return;
            let categoryName = document.querySelector(`div#cards-container`)
              ?.children[0].children[0].id as string;

            // eslint-disable-next-line
            if (!!this.searchTerm) {
              return;
            }

            // edge case if sidebar was closed don't set undefined category
            // because it breaks a lot of things lol
            if (categoryName === undefined || !!this.searchTerm.length) {
              return;
            }

            this.toggleCategoryWithOneKey(categoryName as string);
          }
          break;
        default:
          return;
      }
    },
    toggleSideBarWithC(event: any): void {
      event.preventDefault();
      if (this.route.fullPath !== "/") return;

      this.searchTerm = "";
      let searchTermEl: HTMLElement | null = null;

      setTimeout(() => {
        searchTermEl = document.querySelector(`input#iamsearch`);
      }, 1200);

      const self = this;

      (async function (ms: number): Promise<void> {
        return new Promise(function (resolve) {
          setTimeout(function () {
            if (searchTermEl !== null) {
              searchTermEl.addEventListener("blur", () => {
                if (self.searchTerm !== "") {
                  self.searchTerm = "";
                }
              });
            }
            resolve();
          }, ms);
        });
      })(1500);

      store.commit(
        "sidebar/TOGGLE_SIDEBAR" as RootCommitType,
        {},
        {
          root: true,
        }
      );
    },
    async toggleCategoryWithOneKey(categoryName: string): Promise<void> {
      await store.dispatch(
        "sidebarCategories/toggleWithOneKey" as RootDispatchType,
        { categoryName },
        { root: true }
      );
    },
  },
  mounted() {
    document.addEventListener("keyup", this.listenOnKeyDown);
  },
  unmounted() {
    document.removeEventListener("keyup", this.listenOnKeyDown);
  }
});
</script>

<style lang="scss">
.side-bar {
  background-color: rgb(213, 213, 213);
  position: fixed;
  top: 0;
  height: 100vh;

  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity height 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  height: 0;
}

.big-light {
  color: #2c3e50;
  font-size: 30px;
}

.big-dark {
  color: white;
  font-size: 30px;
}

.open {
  width: 130px;
  transition: 0.2s;
}

.closed {
  width: 0px;
  transition: 0.1s ease 0.3s;
}

.show-me {
  display: block;
}

.hide-me {
  display: none;
}

@media screen and (max-width: 1280px) {
  .hide-sidebar-toggle-mobile {
    visibility: visible;
  }
}

@media screen and (max-width: 580px) {
  .hide-sidebar-toggle-mobile {
    visibility: hidden;
  }
}
</style>
