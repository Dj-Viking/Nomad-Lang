
<template>
  <div :class="{ 'content-shrink': sidebarOpen, 'content-adjust': !sidebarOpen }">
    <nav style="margin: 0">
      <Transition
        type="transition"
        name="fade"
        mode="out-in"
      >
        <div v-if="!isHome">
          <div class="nav-buttons">
            <div class="nav-animate-in">
              <router-link
                style="text-decoration: none"
                class="button is-success"
                :to="'/'"
              >Home</router-link>
            </div>
          </div>
        </div>
        <div v-else>
          <Transition
            type="transition"
            name="fade"
            mode="out-in"
          >
            <div
              v-if="isLoggedIn"
              class="nav-buttons"
            >
              <a
                style="cursor: pointer"
                class="button is-danger"
                @click.prevent="
                  ($event) => {
                    readEvent($event);
                    logout();
                  }
                "
              >Logout</a>
            </div>
            <div
              v-else
              class="nav-buttons"
            >
              <div class="nav-animate-in">
                <router-link
                  style="text-decoration: none; margin-right: 0.5em"
                  class="button is-success"
                  :to="'/login'"
                >Login</router-link>
                <router-link
                  style="text-decoration: none"
                  class="button is-success"
                  :to="'/signup'"
                >Signup</router-link>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </nav>
    <slot />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { defineComponent, computed } from "vue";
import {
  Choice,
  MeQueryResponse,
  MyRootState,
  RootCommitType,
  RootDispatchType,
} from "../types";
import auth from "../utils/AuthService";
// import { keyGen } from "@/utils/keyGen";
import { api } from "@/utils/ApiService";
import { useStore } from "vuex";
import { keyGen } from "@/utils/keyGen";
import { shuffleArray } from "@/utils/shuffleArray";
export default defineComponent({
  name: "BaseLayout",
  props: {
    isHome: Boolean
  },
  setup() {
    const store = useStore<MyRootState>();
    const isLoggedIn = computed(() => store.state.user.user.loggedIn);
    const sidebarOpen = computed(() => store.state.sidebar.sidebar.isOpen);
    return { isLoggedIn, store, sidebarOpen };
  },
  methods: {
    // eslint-disable-next-line
    readEvent(_event: Event): void {
      //do nothing
    },
    logout() {
      auth.clearToken();
      this.store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
        root: true,
      });
      //refetching after setting the token to
      //empty string will not allow for a refresh token on the site
      // this.refetch();
      this.store.commit(
        "cards/SET_DISPLAY_CARDS" as RootCommitType,
        { cards: [] },
        {
          root: true,
        }
      );
    },
  },
  async mounted() {
    if (!auth.getToken()) return;
    const { user, error } = await api.me(auth.getToken() as string);
    if (!!error) {
      // console.error("error during me query on mount!", error);
      auth.clearToken();
      this.store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
        root: true,
      });
      return;
    }

    //set logged in
    this.store.commit("user/SET_LOGGED_IN" as RootCommitType, true, {
      root: true,
    });
    // set user
    this.store.commit(
      "user/SET_USER" as RootCommitType,
      { ...user },
      { root: true }
    );

    console.log("user", user);

    // fetch choices only if the cards the user has in their collection DO NOT have choices in them.
    let choices_or_null: Choice[] | null = null;
    let cards_have_choices = !!user!.cards![0].choices!.length;

    if (!cards_have_choices) {
      console.log("am i here");
      const { choices, err } = await api.updateChoices();

      choices_or_null = choices ? [...choices.data] : null;

      if (err || !choices_or_null) throw {
        error: "choices was null or there was an error fetching for choices"
      };

      const { result, er } = await api.addChoicesToCards(choices_or_null, auth.getToken()!);

      if (er || !result) throw {
        error: "could not update the user's cards choices"
      };
    }

    // set cards if any
    if (user!.cards.length > 0) {
      console.log("am i in setting cards in base layout");

      await this.store.dispatch(
        "cards/setCards" as RootDispatchType,
        {//set choices if null create fake ones here
          cards: user!.cards, choices: choices_or_null || new Array(3).fill(null).map(() => {
            return {
              id: keyGen(),
              text: shuffleArray([...((Math.ceil(Math.random() * 1000)).toString() + "kdjfkjdkjf").split("")]).join("")
            };
          })
        },
        { root: true }
      );

      // update the cards choices in the user's DB


    }
    // set theme
    this.store.commit("theme/SET_THEME" as RootCommitType, user!.themePref, {
      root: true,
    });
  },
  watch: {
    //callback to refresh user token to execute whenever the application router changes
    $route: async function () {
      try {
        if (this.isLoggedIn) {
          const { user, error } = (await api.me(
            auth.getToken() as string
          )) as MeQueryResponse;
          if (!!error) {
            auth.clearToken();
            this.store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
              root: true,
            });
            return;
          }
          auth.setToken(user?.token as string);
          /// set user
          this.store.dispatch(
            "user/setUser" as RootDispatchType,
            { ...user },
            {
              root: true,
            }
          );
          // if (user!.cards!.length > 0) {
          //   await store.dispatch(
          //     "cards/setCards" as RootDispatchType,
          //     { cards: user?.cards },
          //     {
          //       root: true,
          //     }
          //   );
          // }
        }
      } catch (error) {
        auth.clearToken();
        this.store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
          root: true,
        });
        // console.error("error in $route navigation", error);
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.nav-buttons {
  display: flex;
  justify-content: flex-end;
  margin: 0.5em;
}

.divider {
  color: green;
  font-size: 40px;
  margin-left: 10px;
  margin-right: 10px;
}

.link {
  color: green;
  font-size: 40px;
}

@keyframes animatein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.content-shrink {
  margin-left: 100px;
  margin-right: 0px !important;
  transition: 0.2s;
}

.content-adjust {
  margin-left: 0px !important;
  margin-right: 0px !important;
  transition: 0.2s ease 0.3s;
}

.nav-animate-in {
  animation-name: animatein;
  animation-duration: 2s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
