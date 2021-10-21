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
import { RootCommitType } from "@/types";
import { defineComponent, ref } from "@vue/runtime-core";
import store from "../store";

export default defineComponent({
  name: "SideBarNode",
  props: {
    id: String,
    isActive: Boolean,
    categoryName: String,
    categorizedCards: Object,
    allCards: Array,
  },
  setup() {
    const categoryIsActive = ref(false);
    return {
      categoryIsActive,
    };
  },
  methods: {
    toggleActiveCategory(event: any): void {
      console.log("event of clicking the category", event);
      switch (true) {
        case this.isActive:
          {
            // this.categoryIsActive = false;
            store.commit(
              "sidebarCategories/TOGGLE_ONE_SIDECATEG_ACTIVE" as RootCommitType,
              { id: event.target.id },
              { root: true }
            );
          }
          break;
        case !this.categoryIsActive:
          {
            // this.categoryIsActive = true;
            store.commit(
              "sidebarCategories/TOGGLE_ONE_SIDECATEG_ACTIVE" as RootCommitType,
              { id: event.target.id },
              { root: true }
            );
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
