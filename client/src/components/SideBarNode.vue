<template>
  <a
    :id="id"
    :class="{
      'category-item-active': categoryIsActive,
      'category-item-inactive': !categoryIsActive,
    }"
    @click.prevent="toggleActiveCategory($event)"
    :href="`/${categoryName}`"
    >{{ categoryName }}</a
  >
</template>

<script lang="ts">
import { RootCommitType, SidebarCategorizedCardsState } from "@/types";
import { defineComponent, ref } from "@vue/runtime-core";
import store from "../store";

export default defineComponent({
  name: "SideBarNode",
  props: ["id", "categoryName", "categorizedCards", "allCards"],
  computed: {
    sidebarCategoriesState: (): SidebarCategorizedCardsState =>
      store.state.sideBarCategories,
  },
  setup() {
    const categoryIsActive = ref(false);
    return {
      categoryIsActive,
    };
  },
  mounted() {
    console.log("do we have sidebar state", this.sidebarCategoriesState);
  },
  methods: {
    toggleActiveCategory(event: any): void {
      console.log("event of clicking the category", event);
      // console.log("do i have the id here", (<HTMLElement>event.target).id as string);
      switch (true) {
        case this.categoryIsActive:
          {
            this.categoryIsActive = false;
          }
          break;
        case !this.categoryIsActive:
          {
            this.categoryIsActive = true;
          }
          break;
        default:
          return void 0;
      }
      if (!this.categoryIsActive) {
        store.commit("cards/SET_CARDS" as RootCommitType, this.allCards, {
          root: true,
        });
      } else {
        store.commit(
          "cards/SET_CARDS" as RootCommitType,
          this.categorizedCards,
          {
            root: true,
          }
        );
        store.commit(
          "sidebarCategories/SET_ONE_SIDECATEG_ACTIVE" as RootCommitType,
          { id: Number(event.target.id) },
          { root: true }
        );
      }
    },
  },
});
</script>

<style lang="scss">
.category-item-active {
  color: rgb(0, 255, 0);
  &:hover {
    color: rgb(0, 255, 0);
  }
}
.category-item-inactive {
  color: black;
  &:hover {
    color: black;
  }
}
</style>
