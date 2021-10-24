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
            options: {
              email: /@/g.test(loginInput) ? loginInput : '',
              username: /@/g.test(loginInput) ? '' : loginInput,
              password,
            },
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
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent, inject, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { createLoginMutation } from "../graphql/mutations/myMutations";
import {
  LoadingState,
  LoginResponse,
  RootCommitType,
  RootDispatchType,
} from "../types";
import auth from "../utils/AuthService";
import router from "../router";
import store from "../store";
import { FetchResult } from "@apollo/client/core";
import { useToast } from "vue-toastification";

export default defineComponent({
  name: "Login",
  computed: {
    isLoading: (): LoadingState["loading"]["isLoading"] =>
      store.state.loading.loading.isLoading,
  },
  setup(this: void) {
    let globalEmail = inject("$email");
    const toast = useToast();
    const store = useStore();
    const loginInput = ref("");
    const password = ref("");
    const successMsg = ref("");
    const showSuccess = ref(false);
    const {
      mutate: submitLogin,
      loading: loginIsLoading,
      error: loginError,
      onDone: onLoginDone,
    } = useMutation(
      gql`
        ${createLoginMutation()}
      `,
      {
        variables: {
          options: {
            email: loginInput.value,
            username: loginInput.value,
            password: password.value,
          },
        },
      }
    );

    onLoginDone(
      (
        result: FetchResult<
          LoginResponse,
          Record<string, unknown>,
          Record<string, unknown>
        >
      ) => {
        if (result?.data?.login.errors) {
          toast.error(`Error: ${result.data.login.errors[0].message}`, {
            timeout: 3000,
          });
          store.commit("loading/SET_LOADING" as RootCommitType, false, {
            root: true,
          });
        } else {
          toast.success("Logged in", {
            timeout: 2000,
          });
          setTimeout(async () => {
            store.commit("loading/SET_LOADING" as RootCommitType, false, {
              root: true,
            });
            showSuccess.value = false;
            successMsg.value = "";
            const payload = {
              user: result.data?.login.user,
              loggedIn: true,
            };
            store.commit("user/SET_USER" as RootCommitType, payload, {
              root: true,
            });
            await store
              .dispatch(
                "cards/setCards" as RootDispatchType,
                { cards: result.data?.login.cards },
                { root: true }
              )
              .catch((e) =>
                console.error("error when setting cards after logging in", e)
              );
            globalEmail = result?.data?.login.user?.email;
            auth.setToken(result?.data?.login.token as string);
            auth.setEmail(globalEmail as string);
            router.push("/");
          }, 2000);
        }
      }
    );

    onMounted(() => {
      store.commit("loading/SET_LOADING", false, { root: true });
      document.title = "Login";
    });

    return {
      loginInput,
      password,
      submitLogin,
      store,
      loginIsLoading,
      loginError,
      globalEmail,
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
