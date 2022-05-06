<template>
  <base-layout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%"
      @submit.prevent="
        ($event) => {
          store.commit('loading/SET_LOADING', true, { root: true });
          readEvent($event);
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
        <router-link
          :to="'/forgot'"
          class="link"
        >Forgot Password?</router-link>
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
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import {
  LoginResponse,
  MyRootState,
  RootCommitType,
  RootDispatchType,
} from "@/types";
import auth from "@/utils/AuthService";
import router from "@/router";
import { api } from "@/utils/ApiService";
import { useToast } from "vue-toastification";

export default defineComponent({
  name: "Login",
  setup(this: void) {
    const toast = useToast();
    const store = useStore<MyRootState>();
    const loginInput = ref("");
    const password = ref("");
    const isLoading = computed(() => store.state.loading.loading.isLoading);

    onMounted(() => {
      store.commit("loading/SET_LOADING", false, { root: true });
      document.title = "Login";
    });

    return {
      toast,
      isLoading,
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
        this.store.commit("loading/SET_LOADING" as RootCommitType, true, {
          root: true,
        });
        const { user, error } = (await api.login(args)) as LoginResponse;
        if (!!error && typeof user === "undefined") {
          // auth.clearToken();
          this.store.commit("loading/SET_LOADING" as RootCommitType, false, {
            root: true,
          });
          // throw error;
        } else {
          auth.setToken(user!.token as string);
          this.toast.success("Good luck have fun!", {
            timeout: 3000,
          });
          // log in the user
          this.store.commit(
            "user/SET_LOGGED_IN" as RootCommitType,
            { ...user },
            {
              root: true,
            }
          );
          //set user
          this.store.dispatch(
            "user/setUser" as RootDispatchType,
            { ...user },
            {
              root: true,
            }
          );
          // set cards
          await this.store.dispatch(
            "cards/setCards" as RootDispatchType,
            { cards: user!.cards },
            { root: true }
          );
          setTimeout(() => {
            this.store.commit("loading/SET_LOADING" as RootCommitType, false, {
              root: true,
            });
            router.push("/");
          }, 3000);
          // set theme
          this.store.commit("theme/SET_THEME" as RootCommitType, user!.themePref, {
            root: true,
          });
        }
      } catch (error) {
        // console.error("error during login", error);
        auth.clearToken();
        this.store.commit("loading/SET_LOADING" as RootCommitType, false, {
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
