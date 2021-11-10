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
<style lang="scss">
@keyframes toggle-slot-light {
  from {
    background-color: rgb(34, 34, 34);
  }
  to {
    background-color: rgb(255, 172, 49);
  }
}
.toggle-slot-light {
  margin-top: 0.5em;
  margin-left: 0.6em;
  animation: toggle-slot-light;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;
  background-color: rgb(255, 172, 49);
  width: 100px;
  height: 40px;
  z-index: 8000;
  border-radius: 20px;
}

@keyframes toggle-slot-dark {
  from {
    background-color: rgb(255, 172, 49);
  }
  to {
    background-color: rgb(34, 34, 34);
  }
}
.toggle-slot-dark {
  margin-top: 0.5em;
  margin-left: 0.6em;
  animation: toggle-slot-dark;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  background-color: rgb(34, 34, 34);
  cursor: pointer;
  width: 100px;
  height: 40px;
  z-index: 8000;
  border-radius: 20px;
}

@keyframes toggle-dark {
  from {
    left: 8px;
  }
  to {
    left: 69.5px;
  }
}
.my-toggle-dark {
  font-size: 20px;
  color: rgb(34, 34, 34);
  animation: toggle-dark;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  padding: 0;
  background-color: white;
  margin: 0;
  border: none;
  height: 40px;
  width: 40px;
  position: absolute;
  cursor: pointer;
  top: 8px;
  left: 69.5px;
  z-index: 10000;
  border-radius: 50%;
}

@keyframes toggle-light {
  from {
    left: 68px;
  }
  to {
    left: 8px;
  }
}
.my-toggle-light {
  font-size: 20px;
  color: rgb(255, 172, 49);
  background-color: white;
  animation: toggle-light;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  padding: 0;
  margin: 0;
  border: none;
  height: 40px;
  width: 40px;
  position: absolute;
  cursor: pointer;
  top: 8px;
  left: 8px;
  z-index: 10000;
  border-radius: 50%;
}
</style>
