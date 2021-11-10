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
import {
  CardsState,
  RootCommitType,
  SidebarState,
  ThemePrefChangeResponse,
  UserState,
} from "@/types";
import store from "../store";
import { useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { createSetUserThemeMutation } from "@/graphql/mutations/myMutations";
import { FetchResult } from "@apollo/client/core";
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
    const { mutate: submitThemePrefChange, onDone: onThemePrefChangeDone } =
      useMutation(
        gql`
          ${createSetUserThemeMutation()}
        `,
        {
          variables: {
            themePref: themePrefRef.value,
          },
        }
      );

    onThemePrefChangeDone(
      async (
        result: FetchResult<
          ThemePrefChangeResponse,
          Record<string, unknown>,
          Record<string, unknown>
        >
      ): Promise<void> => {
        if (result.data?.setUserTheme.errors?.length) {
          toast.error(
            "We're sorry, There was a problem updating your preferred theme.",
            {
              timeout: 3000,
            }
          );
        }
      }
    );
    return {
      submitThemePrefChange,
    };
  },
  methods: {
    // eslint-disable-next-line
    toggleTheme(_event: any): void {
      store.commit("theme/TOGGLE_THEME" as RootCommitType, {}, { root: true });
      setTimeout(() => {
        if (this.isLoggedIn) {
          this.submitThemePrefChange({
            themePref: this.isLight ? "light" : "dark",
          });
        }
      }, 300);
    },
  },
});
</script>
<style lang="scss"></style>
