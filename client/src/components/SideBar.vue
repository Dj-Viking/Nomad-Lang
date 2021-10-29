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
              "
              :class="{
                'fa fa-chevron-left big': sidebarOpen,
                'fa fa-chevron-right big': !sidebarOpen,
              }"
              aria-hidden="true"
            ></i>
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
              <span :id="categories[key].cards[0]?.frontSideLanguage"
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
  ICard,
  RootCommitType,
  RootDispatchType,
  SidebarState,
} from "@/types";
import SideBarNode from "./SideBarNode.vue";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "SideBar",
  components: {
    SideBarNode,
  },
  data() {
    return {
      allCards: [] as ICard[],
    };
  },
  computed: {
    cards: (): CardsState["cards"] => store.state.cards.cards,
    categories: (): CardsState["categorized"] =>
      store.state.cards.categorized as CategorizedCardsObject,
    sidebarOpen: (): SidebarState["sidebar"]["isOpen"] =>
      store.state.sidebar.sidebar.isOpen,
  },
  methods: {
    // eslint-disable-next-line
    toggleSideBar(_event: MouseEvent): void {
      store.commit(
        "sidebar/TOGGLE_SIDEBAR" as RootCommitType,
        {},
        { root: true }
      );
    },
    toggleSideBarWithC(): void {
      store.commit("sidebar/TOGGLE_SIDEBAR" as RootCommitType, false, {
        root: true,
      });
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
            this.toggleSideBarWithC();
          }
          break;
        case event.key === "1":
          {
            console.log("pressed 1 key", event.target);

            const categoryName = document.querySelector(`div#cards-container`)
              ?.children[0].children[0].id as string;

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
