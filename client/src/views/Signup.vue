<template>
  <BaseLayout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%"
      @submit.prevent="
        ($event) => {
          let event = $event;
          readEvent(event);
          submitRegister({
            options: {
              email,
              username,
              password,
            },
          });
        }
      "
    >
      <label class="mt-0 label">Username</label>
      <input
        class="mt-4 input"
        type="text"
        name="username"
        autocomplete="off"
        v-model="username"
        placeholder="Username"
      />
      <label class="mt-4 label">Email</label>
      <input
        class="mt-4 input"
        type="text"
        name="email"
        autocomplete="off"
        v-model="email"
        placeholder="example@mail.com"
        required
      />
      <label class="mt-4 label">Password</label>
      <input
        class="mt-4 input"
        type="password"
        name="password"
        v-model="password"
        placeholder="***************"
        required
      />
      <button v-if="!isLoading" class="button is-success mt-5">Sign Up!</button>
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
import { defineComponent, inject, onMounted, ref } from "vue";
import BaseLayout from "../components/BaseLayout.vue";
import { useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { createRegisterMutation } from "../graphql/mutations/myMutations";
import { RegisterResponse, RootCommitType } from "../types";
import auth from "../utils/AuthService";
import router from "../router";
import { FetchResult } from "@apollo/client/core";
import store from "../store";
import { useToast } from "vue-toastification";

export default defineComponent({
  name: "Signup",
  components: {
    BaseLayout,
  },
  setup(this: void) {
    let globalEmail = inject("$email");
    const toast = useToast();
    const email = ref("");
    const username = ref("");
    const password = ref("");
    const registerResponse = ref();
    const submitted = ref(false);
    const errMsg = ref("");
    const showError = ref(false);
    const successMsg = ref("");
    const showSuccess = ref(false);
    const isLoading = ref(false);

    const {
      mutate: submitRegister,
      loading: registerIsLoading,
      error: registerError,
      onDone: onRegisterDone,
    } = useMutation(
      gql`
        ${createRegisterMutation()}
      `,
      {
        variables: {
          options: {
            email: email.value,
            username: username.value,
            password: password.value,
          },
        },
      }
    );

    onRegisterDone(
      (
        result: FetchResult<
          RegisterResponse,
          Record<string, unknown>,
          Record<string, unknown>
        >
      ) => {
        submitted.value = true;
        if (result?.data?.register.errors) {
          auth.clearToken();
          store.commit("user/CLEAR_USER_TOKEN" as RootCommitType, null, {
            root: true,
          });
          toast.error(`Error: ${result.data.register.errors[0].message}`, {
            timeout: 3000,
          });
        } else {
          toast.success("Good luck, have fun!", { timeout: 2000 });
          isLoading.value = true;
          console.log(
            "what is token here on signup done",
            result.data?.register.token
          );
          store.commit(
            "user/SET_USER" as RootCommitType,
            result.data?.register.user,
            { root: true }
          );
          auth;
          registerResponse.value = result?.data as RegisterResponse;
          submitted.value = false;
          auth.setToken(result?.data?.register.token as string);
          auth.setEmail(globalEmail as string);
          setTimeout(() => {
            globalEmail = result?.data?.register.user?.email;
            router.push("/");
            isLoading.value = false;
          }, 2000);
        }
      }
    );
    function initFields(): void {
      submitted.value = false;
      email.value = "";
      username.value = "";
      password.value = "";
    }
    onMounted(() => {
      initFields();
      document.title = "Sign Up";
    });

    return {
      submitRegister,
      email,
      showError,
      showSuccess,
      errMsg,
      successMsg,
      username,
      password,
      isLoading,
      registerIsLoading,
      globalEmail,
      registerError,
      registerResponse,
      submitted,
    };
  },
  methods: {
    //to make the ts check compiler happy
    // eslint-disable-next-line
    readEvent(_event: Event): void {
      // do nothing
    },
  },
});
</script>
<style>
/* .Vue-Toastification__toast {
  background-color: #f14668;
}
.Vue-Toastification__toast--error {
  background-color: #f14668;
}
.Vue-Toastification__toast-body {
  background-color: #f14668;
} */
</style>
