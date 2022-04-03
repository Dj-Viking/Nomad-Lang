ChangeThemePrefResponse,
<template>
  <Transition type="transition" name="fade" mode="out-in">
    <div v-if="sidebarOpen || cards.length > 0" style="width: 100px">
      <div
        :class="{ 'toggle-slot-light': isLight, 'toggle-slot-dark': isDark }"
        @click.prevent="
          ($event) => {
            (async () => {
              await toggleTheme($event);
            })();
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
            (async () => {
              await toggleTheme($event);
            })();
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
import { defineComponent } from "@vue/runtime-core";
import {
  CardsState,
  ChangeThemePrefResponse,
  RootCommitType,
  SidebarState,
  UserState,
} from "@/types";
import store from "../store";
import { useToast } from "vue-toastification";
import { api } from "@/utils/ApiService";
import auth from "@/utils/AuthService";
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
    return { toast };
  },
  methods: {
    // eslint-disable-next-line
    async toggleTheme(_event: any): Promise<void> {
      store.commit("theme/TOGGLE_THEME" as RootCommitType, {}, { root: true });
      setTimeout(async () => {
        if (this.isLoggedIn) {
          await this.submitThemePrefChange(this.isLight ? "light" : "dark");
        }
      }, 300);
    },
    async submitThemePrefChange(theme_input: string): Promise<void> {
      try {
        const { error } = (await api.changeThemePref(
          auth.getToken() as string,
          theme_input
        )) as ChangeThemePrefResponse;
        if (!!error) throw error;
      } catch (error) {
        console.error(error);
        const err = error as Error;
        this.toast.error(
          `There was an error during changing the theme ${err.message}`
        );
      }
    },
  },
});
</script>
<style lang="scss"></style>
