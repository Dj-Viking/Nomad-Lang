<template>
  <base-layout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%; margin-top: 2em"
      @submit.prevent="
        ($event) => {
          readEvent($event);
          isLoading = true;
          submitForgotPassword({
            email: emailInput,
          });
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
import { FetchResult } from "@apollo/client/core";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import router from "../router";
import { createForgotPasswordMutation } from "@/graphql/mutations/myMutations";
import { ForgotPassResponse } from "@/types";
import { useToast } from "vue-toastification";
export default defineComponent({
  name: "Forgot",
  setup(this: void) {
    const isLoading = ref(false);
    const toast = useToast();
    const emailInput = ref("");

    const { mutate: submitForgotPassword, onDone } = useMutation(
      gql`
        ${createForgotPasswordMutation()}
      `,
      {
        variables: {
          email: emailInput.value,
        },
      }
    );

    onMounted(() => {
      document.title = "Forgot Password";
    });

    onDone(
      (
        result: FetchResult<
          ForgotPassResponse,
          Record<string, unknown>,
          Record<string, unknown>
        >
      ): void => {
        if (result.data?.forgotPassword.errors?.length) {
          isLoading.value = false;
          //set some error toast saying something went wrong with the request
          toast.error("something went wrong with this request", {
            timeout: 3000,
          });
        } else {
          isLoading.value = false;
          //set some toast message saying if an account has that email then the email was sent with a password reset link
          toast.success(
            "A password reset link was sent to the given email address",
            {
              timeout: 3000,
            }
          );
          router.push("/");
        }
      }
    );

    return {
      isLoading,
      emailInput,
      submitForgotPassword,
    };
  },
  methods: {
    readEvent(event: Event) {
      console.log("submitted the form", event);
    },
  },
});
</script>
