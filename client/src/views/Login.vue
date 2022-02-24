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
          submitLogin({
            email: /@/g.test(loginInput) ? loginInput : '',
            username: /@/g.test(loginInput) ? '' : loginInput,
            password,
          });
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
        :disabled="!loginInput || !password"
        v-if="!isLoading"
        class="button is-success mt-5"
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
  // RootDispatchType,
} from "../types";
// import auth from "../utils/AuthService";
// import router from "../router";
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

    const submitLogin = async (args: {
      username?: string;
      email?: string;
      password: string;
    }): Promise<void> => {
      try {
        const userOrError = (await api.login(args)) as LoginResponse;
        console.log("user or error", userOrError);
        store.commit("loading/SET_LOADING" as RootCommitType, false, {
          root: true,
        });
      } catch (error) {
        console.error("error during login", error);
        store.commit("loading/SET_LOADING" as RootCommitType, false, {
          root: true,
        });
      }
    };

    onMounted(() => {
      store.commit("loading/SET_LOADING", false, { root: true });
      document.title = "Login";
    });

    return {
      toast,
      submitLogin,
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
  },
});
</script>
