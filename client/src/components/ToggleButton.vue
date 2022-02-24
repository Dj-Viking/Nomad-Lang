<template>
  <Transition type="transition" name="fade" mode="out-in">
    <div v-if="sidebarOpen || cards.length > 0" style="width: 100px">
      <div
        :class="{ 'toggle-slot-light': isLight, 'toggle-slot-dark': isDark }"
        @click.prevent="
          ($event) => {
            toggleTheme($event);
          }
        "
      >
        &nbsp;
      </div>
      <button
        id="toggle-btn"
        type="button"
        @click.prevent="
          ($event) => {
            toggleTheme($event);
          }
        "
        class="button"
        :class="{ 'my-toggle-light': isLight, 'my-toggle-dark': isDark }"
      >
        <i :class="{ 'fa fa-sun-o': isLight, 'fa fa-moon-o': isDark }"></i>
      </button>
    </div>
    <div v-else>
      <div></div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { CardsState, RootCommitType, SidebarState, UserState } from "@/types";
import store from "../store";
import { useToast } from "vue-toastification";
export default defineComponent({
  name: "ToggleButton",
  computed: {
    sidebarOpen: (): SidebarState["sidebar"]["isOpen"] =>
      store.state.sidebar.sidebar.isOpen,
    cards: (): CardsState["cards"] => store.state.cards.cards,
    isLoggedIn: (): UserState["user"]["loggedIn"] =>
      store.state.user.user.loggedIn,
    isLight: () => store.state.theme.theme === "light",
    isDark: () => store.state.theme.theme === "dark",
  },
  setup() {
    const toast = useToast();
    const themePrefRef = ref("");

    return {
      themePrefRef,
      toast,
    };
  },
  methods: {
    // eslint-disable-next-line
    toggleTheme(_event: any): void {
      store.commit("theme/TOGGLE_THEME" as RootCommitType, {}, { root: true });
      setTimeout(() => {
        if (this.isLoggedIn) {
          // this.submitThemePrefChange({
          //   themePref: this.isLight ? "light" : "dark",
          // });
        }
      }, 300);
    },
  },
});
</script>
<style lang="scss"></style>
