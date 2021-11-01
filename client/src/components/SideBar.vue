<template>
  <div class="side-bar" :class="{ open: sidebarOpen, closed: !sidebarOpen }">
    <div style="display: flex; flex-direction: column; min-width: 100px">
      <Transition type="transition" name="fade" mode="out-in">
        <div v-if="sidebarOpen">
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
            "
          >
            <i
              @click.prevent="
                ($event) => {
                  toggleSideBar($event);
                }
              "
              style="
                cursor: pointer;
                margin-top: 0.5em;
                margin-left: 0.5em;
                margin-right: 0.5em;
                margin-bottom: 0.5em;
              "
              :class="{
                'fa fa-chevron-left big': sidebarOpen,
                'fa fa-chevron-right big': !sidebarOpen,
              }"
              aria-hidden="true"
            ></i>

            <input
              placeholder="Search"
              class="input"
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
                margin-bottom: 1em;
                margin-top: 1em;
                margin-left: 10px;
                height: 30px;
              "
              class="title"
            >
              Your Categories
            </h4>
          </div>
          <div id="cards-container">
            <div v-for="(key, i) of Object.keys(categories)" :key="i">
              <span
                :id="
                  !!categories[key] &&
                  categories[key].cards[0]?.frontSideLanguage
                "
                >{{ i + 1 }}.&nbsp;</span
              >
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
          <div style="display: flex; flex-direction: row">
            <i
              @click.prevent="
                ($event) => {
                  toggleSideBar($event);
                }
              "
              style="
                cursor: pointer;
                margin-top: 0.5em;
                margin-left: 0.5em;
                margin-right: 0.5em;
              "
              :class="{
                'fa fa-chevron-left big': sidebarOpen,
                'fa fa-chevron-right big': !sidebarOpen,
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
import store from "@/store";
import {
  CardsState,
  CategorizedCardsObject,
  RootCommitType,
  RootDispatchType,
  SidebarState,
} from "@/types";
import { escapeRegexp } from "@/utils/escapeRegexp";
import SideBarNode from "./SideBarNode.vue";
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  name: "SideBar",
  components: {
    SideBarNode,
  },
  setup() {
    const searchTerm = ref("");
    return {
      searchTerm,
    };
  },
  computed: {
    cards: (): CardsState["cards"] => store.state.cards.cards,
    categories: (): CardsState["categorized"] =>
      store.state.cards.categorized as CategorizedCardsObject,
    sidebarOpen: (): SidebarState["sidebar"]["isOpen"] =>
      store.state.sidebar.sidebar.isOpen,
    sidebarSearchTerm: (): SidebarState["sidebar"]["searchTerm"] =>
      store.state.sidebar.sidebar.searchTerm,
  },
  methods: {
    search(event: any): void {
      const input = event.target.value;
      store.commit("sidebar/SET_SEARCH_TERM" as RootCommitType, input, {
        root: true,
      });
      console.log("search value", input);
      //set categories that match the content of the cards in the array
      const searchRegex = new RegExp(`(${escapeRegexp(input)})+`, "g");
      console.log("search regex", searchRegex);

      //highlight them in the DOM
      return;
    },
    // eslint-disable-next-line
    toggleSideBar(_event: MouseEvent): void {
      this.searchTerm = "";
      let searchTermEl: HTMLElement | null = null;
      setTimeout(() => {
        searchTermEl = document.querySelector(`input#iamsearch`);
        console.log("searchterm el", searchTermEl);
      }, 1200);

      // let tempSearchTerm = this.sidebarSearchTerm;

      // eslint-disable-next-line
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
      })(1300);
      store.commit(
        "sidebar/TOGGLE_SIDEBAR" as RootCommitType,
        {},
        { root: true }
      );
    },
    toggleSideBarWithC(): void {
      this.searchTerm = "";
      let searchTermEl: HTMLElement | null = null;
      setTimeout(() => {
        searchTermEl = document.querySelector(`input#iamsearch`);
        console.log("searchterm el", searchTermEl);
      }, 1200);

      // let tempSearchTerm = this.sidebarSearchTerm;

      // eslint-disable-next-line
      const self = this;

      (async function (ms: number): Promise<void> {
        return new Promise(function (resolve) {
          setTimeout(function () {
            if (searchTermEl !== null) {
              searchTermEl.addEventListener("blur", () => {
                console.log("listening on blur");
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
  mounted: function (): void {
    //arrow function because i need "this" keyword to be in context of vue component

    document.addEventListener("keyup", (event) => {
      switch (true) {
        case event.key === "c" || event.key === "C":
          {
            // eslint-disable-next-line
            if (!!this.searchTerm) return;

            this.toggleSideBarWithC();
          }
          break;
        case event.key === "1":
          {
            console.log("pressed 1 key", event.target);

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

            this.toggleCategoryWithOneKey(categoryName);
          }
          break;
        default:
          return;
      }
    });
  },
  unmounted: function (): void {
    document.removeEventListener("keyup", this.toggleSideBarWithC);
  },
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

.big {
  font-size: 30px;
}

.open {
  width: 100px;
  transition: 0.2s;
}

.closed {
  width: 0px;
  transition: 0.1s ease 0.3s;
}
</style>
