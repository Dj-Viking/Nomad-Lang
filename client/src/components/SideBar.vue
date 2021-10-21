<template>
  <div class="side-bar">
    <div style="display: flex; justify-content: flex-start">
      <div style="display: flex; flex-direction: column">
        <div style="display: flex; flex-direction: row">
          <h3 class="title">Your Categories</h3>
          <i
            @click.prevent="
              ($event) => {
                toggleSideBar($event);
              }
            "
            style="cursor: pointer; margin-top: 1em"
            :class="{
              'fa fa-chevron-left big': sidebarOpen,
              'fa fa-chevron-right big': !sidebarOpen,
            }"
            aria-hidden="true"
          ></i>
        </div>
        <div v-for="(key, i) of Object.keys(categories)" :key="i">
          <SideBarNode
            :id="categories[key].id"
            :allCards="cards"
            :categoryName="key"
            :categorizedCards="categories[key].cards"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { CardsState, CategorizedCardsObject } from "@/types";
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
});
</script>

<style lang="scss">
.side-bar {
  background-color: rgb(213, 213, 213);
  position: fixed;
  top: 0;
  height: 100vh;
  width: 20vh;
  z-index: 10000;
}

.big {
  font-size: 30px;
}
</style>
