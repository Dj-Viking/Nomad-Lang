<template>
  <BaseLayout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%"
      @submit.prevent="
        ($event) => {
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
      <label class="label mt-0">Email or Username</label>
      <input
        class="input mt-4"
        type="text"
        name="email-or-username"
        autocomplete="off"
        v-model="loginInput"
        placeholder="example@mail.com | my_username"
        required
      />
      <label class="label mt-4">Password</label>
      <input
        class="input mt-4"
        type="password"
        autocomplete="off"
        name="password"
        v-model="password"
        placeholder="*****************"
        required
      />
      <button v-if="!isLoading" class="button is-success mt-5">Login</button>
      <button
        v-if="isLoading"
        is-loading
        class="button is-loading is-success mt-5"
      >
        Login
      </button>
    </form>
  </BaseLayout>
</template>
<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent, inject, ref, onMounted } from "vue";
import BaseLayout from "../components/BaseLayout.vue";
import { createLoginMutation } from "../graphql/mutations/myMutations";
import { LoginResponse, RootCommitType } from "../types";
import auth from "../utils/AuthService";
import router from "../router";
import store from "../store";
import { FetchResult } from "@apollo/client/core";
import { useToast } from "vue-toastification";

export default defineComponent({
  name: "Login",
  components: {
    BaseLayout,
  },
  setup(this: void) {
    let globalEmail = inject("$email");
    const toast = useToast();
    const loginInput = ref("");
    const password = ref("");
    const successMsg = ref("");
    const showSuccess = ref(false);
    const isLoading = ref(false);
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
        } else {
          isLoading.value = true;
          toast.success("Logged in", {
            timeout: 2000,
          });
          setTimeout(() => {
            isLoading.value = false;
            showSuccess.value = false;
            successMsg.value = "";
            console.log("login response new value", result.data?.login);
            const payload = {
              user: result.data?.login.user,
              loggedIn: true,
            };
            store.commit("user/SET_USER" as RootCommitType, payload, {
              root: true,
            });
            globalEmail = result?.data?.login.user?.email;
            auth.setToken(result?.data?.login.token as string);
            auth.setEmail(globalEmail as string);
            router.push("/");
          }, 2000);
        }
      }
    );

    onMounted(() => {
      document.title = "Login";
    });

    return {
      loginInput,
      password,
      submitLogin,
      loginIsLoading,
      isLoading,
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
