<template>
  <div
    :class="{ 'content-shrink': sidebarOpen, 'content-adjust': !sidebarOpen }"
  >
    <nav style="margin: 0">
      <Transition type="transition" name="fade">
        <div v-if="!isHome">
          <router-link style="text-decoration: none" class="link" :to="'/'"
            >Home</router-link
          >
        </div>
        <div v-else>
          <Transition type="transition" name="fade">
            <div v-if="isLoggedIn" class="nav-buttons">
              <a
                style="cursor: pointer"
                class="button is-danger"
                @click.prevent="
                  ($event) => {
                    readEvent($event);
                    logout();
                  }
                "
                >Logout</a
              >
            </div>
            <div v-else class="nav-buttons">
              <div class="nav-animate-in">
                <router-link
                  style="text-decoration: none; margin-right: 0.5em"
                  class="button is-success"
                  :to="'/login'"
                  >Login</router-link
                >
                <router-link
                  style="text-decoration: none"
                  class="button is-success"
                  :to="'/signup'"
                  >Signup</router-link
                >
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
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { mapState } from "vuex";
import {
  ICard,
  MeQueryResponse,
  RootCommitType,
  RootDispatchType,
  SidebarState,
  UserState,
} from "../types";
import { createMeQuery } from "../graphql/queries/myQueries";
import auth from "../utils/AuthService";
import store from "../store";

export default defineComponent({
  name: "BaseLayout",
  props: ["isHome"],
  setup() {
    //graphql me query for checking if the token is expired.
    //basically if the backend returns a token whenever the route changes. the user gets a new token. otherwise if user is idle on the page, the token would expire after about an hour...for now
    const { result: meResult, refetch } = useQuery(
      gql`
        ${createMeQuery()}
      `
    );

    return { meResult, refetch };
  },
  computed: {
    ...mapState(["user"]),
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
    async logout() {
      auth.setToken("");
      store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
        root: true,
      });
      //refetching after setting the token to
      //empty string will not allow for a refresh token on the site
      // this.refetch();
      await store.commit(
        "cards/SET_DISPLAY_CARDS" as RootCommitType,
        { cards: [] },
        {
          root: true,
        }
      );
    },
  },
  watch: {
    //callback to refresh user token to execute whenever the application router changes
    $route: async function () {
      await this.refetch();
    },
    meResult: async function (newValue: MeQueryResponse) {
      if (newValue.me.errors?.length) {
        auth.clearToken();
        this.isLoggedIn = false;
        await store.dispatch("user/setUser", null, { root: true });
        store.commit(
          "cards/SET_DISPLAY_CARDS" as RootCommitType,
          {
            cards: [
              {
                frontSideText: "sign in to see and add your own cards!!!",
                frontSideLanguage: "sign in to see and add your own cards!!!",
                frontSidePicture: "sign in to see and add your own cards!!!",
                backSideText: "sign in to see and add your own cards!!!",
                backSideLanguage: "sign in to see and add your own cards!!!",
                backSidePicture: "sign in to see and add your own cards!!!",
                id: 0,
                createdAt: "right now",
                updatedAt: "just now",
                creatorId: 0,
              } as ICard,
            ],
          },
          { root: true }
        );
        store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
          root: true,
        });
      } else {
        //set new token in storage
        auth.setToken(newValue.me.user.token as string);
        store.commit("user/SET_LOGGED_IN" as RootCommitType, true, {
          root: true,
        });

        await store.dispatch(
          "cards/setCards" as RootDispatchType,
          { cards: newValue.me.cards },
          { root: true }
        );

        // console.log("response of dispatch of set cat cards", res);
        //set user vuex state with cards
        await store.dispatch(
          "user/setUser" as RootDispatchType,
          { ...newValue.me.user },
          {
            root: true,
          }
        );
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
  animation-duration: 4s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
