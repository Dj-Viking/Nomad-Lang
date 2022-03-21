<template>
  <base-layout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%"
      @submit.prevent="
        ($event) => {
          store.commit('loading/SET_LOADING', true, { root: true });
          let event = $event;
          readEvent(event);
        }
      "
    >
      <div class="field">
        <label class="label mt-0">Email or Username</label>
        <div class="control">
          <input
            class="input mt-4"
            type="text"
            name="email-or-username"
            autocomplete="off"
            v-model="loginInput"
            placeholder="example@mail.com | my_username"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label mt-4">Password</label>
        <div class="control">
          <input
            class="input mt-4"
            type="password"
            autocomplete="off"
            name="password"
            v-model="password"
            placeholder="*****************"
            required
          />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <router-link :to="'/forgot'" class="link">Forgot Password?</router-link>
      </div>
      <button
        type="submit"
        :disabled="!loginInput || !password"
        v-if="!isLoading"
        class="button is-success mt-5"
        @click.prevent="
          () => {
            (async () => {
              await submitLogin({
                email: /@/g.test(loginInput) ? loginInput : '',
                username: /@/g.test(loginInput) ? '' : loginInput,
                password,
              });
            })();
          }
        "
      >
        Login
      </button>
      <button
        v-if="isLoading"
        is-loading
        class="button is-loading is-success mt-5"
      >
        Login
      </button>
    </form>
  </base-layout>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import {
  LoadingState,
  LoginResponse,
  RootCommitType,
  RootDispatchType,
  // RootDispatchType,
} from "../types";
import auth from "../utils/AuthService";
import router from "../router";
import { api } from "@/utils/ApiService";
import store from "../store";
import { useToast } from "vue-toastification";

export default defineComponent({
  name: "Login",
  computed: {
    isLoading: (): LoadingState["loading"]["isLoading"] =>
      store.state.loading.loading.isLoading,
  },
  setup(this: void) {
    const toast = useToast();
    const store = useStore();
    const loginInput = ref("");
    const password = ref("");

    onMounted(() => {
      store.commit("loading/SET_LOADING", false, { root: true });
      document.title = "Login";
    });

    return {
      toast,
      loginInput,
      password,
      store,
    };
  },
  methods: {
    // to make tscheck compiler happy.
    // eslint-disable-next-line
    readEvent(_event: Event): void {
      //do nothing
    },
    async submitLogin(args: {
      username?: string;
      email?: string;
      password: string;
    }): Promise<void> {
      try {
        store.commit("loading/SET_LOADING" as RootCommitType, true, {
          root: true,
        });
        const { user, error } = (await api.login(args)) as LoginResponse;
        if (!!error && typeof user === "undefined") {
          // auth.clearToken();
          store.commit("loading/SET_LOADING" as RootCommitType, false, {
            root: true,
          });
          // throw error;
        } else {
          auth.setToken(user!.token as string);
          this.toast.success("Good luck have fun!", {
            timeout: 3000,
          });
          // log in the user
          store.commit(
            "user/SET_LOGGED_IN" as RootCommitType,
            { ...user },
            {
              root: true,
            }
          );
          //set user
          store.dispatch(
            "user/setUser" as RootDispatchType,
            { ...user },
            {
              root: true,
            }
          );
          // set cards
          await store.dispatch(
            "cards/setCards" as RootDispatchType,
            { cards: user!.cards },
            { root: true }
          );
          setTimeout(() => {
            store.commit("loading/SET_LOADING" as RootCommitType, false, {
              root: true,
            });
            router.push("/");
          }, 3000);
          // set theme
          store.commit("theme/SET_THEME" as RootCommitType, user!.themePref, {
            root: true,
          });
        }
      } catch (error) {
        console.error("error during login", error);
        auth.clearToken();
        store.commit("loading/SET_LOADING" as RootCommitType, false, {
          root: true,
        });
        this.toast.error(`Oops! There was a problem with login ${error}`, {
          timeout: 3000,
        });
      }
    },
  },
});
</script>
