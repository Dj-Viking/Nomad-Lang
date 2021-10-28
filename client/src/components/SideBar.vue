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
    toggleSideBarWithC(event: any): void {
      if (event.key === "c" || event.key === "C") {
        store.commit("sidebar/TOGGLE_SIDEBAR" as RootCommitType, false, {
          root: true,
        });
      }
    },
    toggleActiveCategory(eventOrId: any, categoryName: string): void {
      let id = "";
      let wasClicked = true;
      console.log("categoryname passed from 1 key press", categoryName);
      // eslint-disable-next-line
      if (typeof eventOrId === "object") {
        // eslint-disable-next-line
        id = eventOrId.target.id;
      } else {
        // eslint-disable-next-line
        id = eventOrId;
        wasClicked = false;
        console.log(
          "whats the id inside toggle active function now after one keypress",
          id
        );
      }
      let inactiveCount = 0;
      let activeCount = 0;
      // const categoriesKeys = Object.keys(this.categories);
      // console.log("categories keys", categoriesKeys);
      for (const key in this.categories as CategorizedCardsObject) {
        if (!this.categories[key].isActive) {
          // if all inactive reset to all cards again
          // eslint-disable-next-line
            // @ts-ignore
          !this.categories[key].isActive && inactiveCount++;
        }

        if (this.categories[key].isActive) {
          // eslint-disable-next-line
              // @ts-ignore
          this.categories[key].isActive && activeCount++;
        }
      }
      if (inactiveCount > 1 && activeCount === 0) {
        if (!wasClicked) {
          console.log(
            "what is active here when not clicked",
            this.categories[categoryName].isActive
          );
        }
        //reset all cards again
        store.commit(
          "cards/SET_DISPLAY_CARDS" as RootCommitType,
          { cards: this.allCards },
          {
            root: true,
          }
        );
      }
      if (activeCount === 1 && inactiveCount >= 1) {
        if (!wasClicked && this.categories[categoryName].isActive) {
          console.log("was not clicked used 1 key press");
          console.log(
            "what is active here",
            this.categories[categoryName].isActive
          );
          store.commit(
            "cards/SET_DISPLAY_CARDS" as RootCommitType,
            { cards: this.allCards },
            { root: true }
          );
        }
        console.log("are we here only one active and 1 or more inactive");
        //toggle with the information we got, id and categoryname
        store.commit(
          "sidebarCategories/TOGGLE_ONE_SIDECATEG_ACTIVE" as RootCommitType,
          { id: id },
          { root: true }
        );
        store.commit(
          "cards/SET_DISPLAY_CARDS" as RootCommitType,
          { cards: this.categories[categoryName].cards },
          {
            root: true,
          }
        );
      }
    },
  },
  mounted: function (): void {
    //arrow function because i need "this" keyword to be in context of vue component
    document.addEventListener("keyup", (event) => {
      if (event.key === "c" || event.key === "C") {
        this.toggleSideBarWithC(event);
      } else if (event.key === "1") {
        console.log("pressed 1 key", event.target);
        const id =
          document.querySelector(`div#cards-container`)?.children[0].children[1]
            .id;

        const categoryName = document.querySelector(`div#cards-container`)
          ?.children[0].children[0].id as any;

        this.toggleActiveCategory(id, categoryName);
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
