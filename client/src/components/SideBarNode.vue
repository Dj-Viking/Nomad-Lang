<template>
  <a
    :id="id"
    :class="{
      'category-item-active': isActive,
      'category-item-inactive': !isActive,
    }"
    @click.prevent="toggleActiveCategory($event)"
    :href="`/${categoryName}`"
    >{{ categoryName }}</a
  >
</template>

<script lang="ts">
import { CategorizedCardsObject, RootCommitType } from "@/types";
import { defineComponent } from "@vue/runtime-core";
import store from "../store";

export default defineComponent({
  name: "SideBarNode",
  props: {
    id: String,
    isActive: Boolean,
    categoryName: String,
    categorizedCards: Array,
    categories: Object,
    allCards: Array,
  },
  methods: {
    toggleActiveCategory(event: any): void {
      console.log("event of clicking the category", event);
      const id = event.target.id;
      switch (true) {
        case this.isActive:
          {
            store.commit(
              "sidebarCategories/TOGGLE_ONE_SIDECATEG_ACTIVE" as RootCommitType,
              { id: id },
              { root: true }
            );
          }
          break;
        case !this.isActive:
          {
            store.commit(
              "sidebarCategories/TOGGLE_ONE_SIDECATEG_ACTIVE" as RootCommitType,
              { id: id },
              { root: true }
            );
          }
          break;
        default:
          return void 0;
      }
      for (const key in this.categories as CategorizedCardsObject) {
        // if all inactive reset to all cards again
        let inactiveCount = 0;
        let activeCount = 0;
        // eslint-disable-next-line
          // @ts-ignore
        !this.categories[key].isActive && inactiveCount++;
        // eslint-disable-next-line
          // @ts-ignore
        this.categories[key].isActive && activeCount++;
        if (inactiveCount > 1 && activeCount === 0) {
          //reset all cards again
          store.commit("cards/SET_CARDS" as RootCommitType, this.allCards, {
            root: true,
          });
        }
        // if one is active, set cards to that active category
        // eslint-disable-next-line
              // @ts-ignore
        if (activeCount === 1 && this.categories[key].id === id) {
          store.commit(
            "cards/SET_CARDS" as RootCommitType,
            // eslint-disable-next-line
                  // @ts-ignore
            this.categories[key].cards,
            {
              root: true,
            }
          );
        }
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
