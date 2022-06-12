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
import { defineComponent } from "vue";
import {
  MeQueryResponse,
  RootCommitType,
  RootDispatchType,
  SidebarState,
  UserState,
} from "../types";
import auth from "../utils/AuthService";
import store from "../store";
// import { keyGen } from "@/utils/keyGen";
import { api } from "@/utils/ApiService";
export default defineComponent({
  name: "BaseLayout",
  props: {
    isHome: Boolean
  },
  computed: {
    //if i need to change this read only state i need to dispatch an action or commit some mutation
    isLoggedIn: (): UserState["user"]["loggedIn"] =>
      store.state.user.user.loggedIn,
    sidebarOpen: (): SidebarState["sidebar"]["isOpen"] =>
      store.state.sidebar.sidebar.isOpen,
  },
  methods: {
    // eslint-disable-next-line
    readEvent(_event: Event): void {
      //do nothing
    },
    logout() {
      auth.clearToken();
      store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
        root: true,
      });
      //refetching after setting the token to
      //empty string will not allow for a refresh token on the site
      // this.refetch();
      store.commit(
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
      store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
        root: true,
      });
      return;
    }
    //set logged in
    store.commit("user/SET_LOGGED_IN" as RootCommitType, true, {
      root: true,
    });
    // set user
    store.commit(
      "user/SET_USER" as RootCommitType,
      { ...user },
      { root: true }
    );
    // TODO: api call here to get choices ready before user tries to use them on the cards before they are set...
    const { choices, err } = await api.updateChoices();
    if (error) throw err;
    console.log("did we get choice objects here in base layout", choices);

    // set cards if any
    if (user!.cards.length > 0) {

      await store.dispatch(
        "cards/setCards" as RootDispatchType,
        { cards: user!.cards },
        { root: true }
      );
    }
    // set theme
    store.commit("theme/SET_THEME" as RootCommitType, user!.themePref, {
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
            store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
              root: true,
            });
            return;
          }
          auth.setToken(user?.token as string);
          /// set user
          store.dispatch(
            "user/setUser" as RootDispatchType,
            { ...user },
            {
              root: true,
            }
          );
          if (user!.cards!.length > 0) {
            store.dispatch(
              "cards/setCards" as RootDispatchType,
              { cards: user?.cards },
              {
                root: true,
              }
            );
          }
        }
      } catch (error) {
        auth.clearToken();
        store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
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
