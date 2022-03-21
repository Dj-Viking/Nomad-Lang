<template>
  <base-layout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%; margin-top: 2em"
      @submit.prevent="
        ($event) => {
          readEvent($event);
          isLoading = true;
          (async () => {
            await submitForgotPassword(emailInput);
          })();
        }
      "
    >
      <div class="field">
        <label for="emailInput" class="label"
          >Enter an email to send the reset link to</label
        >
        <div class="control">
          <input
            class="input"
            type="text"
            autocomplete="off"
            required
            placeholder="your@email.com"
            name="emailInput"
            v-model="emailInput"
          />
        </div>
      </div>
      <button
        :disabled="!emailInput"
        v-if="!isLoading"
        class="button is-success mt-5"
      >
        Send Reset Link
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
import { ref, defineComponent, onMounted } from "@vue/runtime-core";
// import router from "../router";
import { useToast } from "vue-toastification";
import { api } from "@/utils/ApiService";
import { ForgotPassResponse, RootCommitType } from "@/types";
import store from "@/store";
import router from "@/router";
export default defineComponent({
  name: "Forgot",
  setup(this: void) {
    const isLoading = ref(false);
    const toast = useToast();
    const emailInput = ref("");

    onMounted(() => {
      document.title = "Forgot Password";
    });

    return {
      isLoading,
      emailInput,
      toast,
    };
  },
  methods: {
    async submitForgotPassword(email: string): Promise<void> {
      store.commit("loading/SET_LOADING" as RootCommitType, true, {
        root: true,
      });
      const { done, error } = (await api.forgotPassword(
        email
      )) as ForgotPassResponse;
      if (!!error) {
        this.isLoading = false;
        store.commit("loading/SET_LOADING" as RootCommitType, false, {
          root: true,
        });
        this.toast.error(
          `Error happened during forgot password request ${error}`,
          {
            timeout: 3000,
          }
        );
      }
      if (done) {
        this.toast.success(
          "If there is an account with that email, a password reset request email is being sent now!",
          {
            timeout: 3000,
          }
        );
        setTimeout(() => {
          this.isLoading = false;
          store.commit("loading/SET_LOADING" as RootCommitType, false, {
            root: true,
          });
          router.push("/login");
        }, 3000);
        console.log("done", done);
      }
    },
    // eslint-disable-next-line
    readEvent(_event: Event) {
      // do nothing
    },
  },
});
</script>
