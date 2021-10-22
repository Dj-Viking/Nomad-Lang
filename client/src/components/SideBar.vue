<template>
  <div class="side-bar" :class="{ open: sidebarOpen, closed: !sidebarOpen }">
    <div style="display: flex; flex-direction: column; min-width: 200px">
      <Transition type="transition" name="fade" mode="out-in">
        <div v-if="sidebarOpen">
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
            "
            mode="out-in"
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
                font-size: 20px;
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
          <div v-for="(key, i) of Object.keys(categories)" :key="i">
            <SideBarNode
              :id="categories[key].id?.toString()"
              :allCards="allCards"
              :isActive="categories[key].isActive"
              :categoryName="key"
              :categories="categories"
              :categorizedCards="categories[key].cards"
            />
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
import { CardsState, CategorizedCardsObject, ICard } from "@/types";
import SideBarNode from "./SideBarNode.vue";
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  name: "SideBar",
  components: {
    SideBarNode,
  },
  setup() {
    const sidebarOpen = ref(false);
    return {
      sidebarOpen,
    };
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
  },
  methods: {
    toggleSideBar(event: MouseEvent): void {
      console.log("open side bar click event", event);
      if (this.sidebarOpen) this.sidebarOpen = false;
      else this.sidebarOpen = true;
    },
  },
  mounted() {
    //have to wait until the cards resolve from the me query or however i get cards
    // and then assign it to the prop that the sidebar item needs to set cards when
    // activating and deactivating a category
    setTimeout(() => {
      if (this.cards) {
        console.log("what is cards here on sidebar mounting", this.cards);
        this.allCards = this.cards;
      }
    }, 400);
  },
});
</script>

<style lang="scss">
.side-bar {
  background-color: rgb(213, 213, 213);
  position: fixed;
  top: 0;
  height: 100vh;

  z-index: 10000;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity height 0.2s ease;
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
  width: 200px;
  transition: 0.2s;
}

.closed {
  width: 0px;
  transition: 0.1s ease 0.3s;
}
</style>
