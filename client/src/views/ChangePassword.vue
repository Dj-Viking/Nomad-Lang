<template>
  <base-layout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%; margin-top: 2em"
      @submit.prevent="
        ($event) => {
          readEvent($event);
          isLoading = true;
          const matched = verifyMatch(passwordInput, confirmInput);
          if (matched) {
            submitChangePassword({
              password: passwordInput,
              token: route.params.token || '',
            });
          } else {
            isLoading = false;
            toast.error(
              'Entered password and confirmed password do not match.',
              {
                timeout: 3000,
              }
            );
          }
        }
      "
    >
      <div class="field">
        <label for="passwordInput" class="label">New Password</label>
        <div class="control">
          <input
            class="input"
            type="password"
            autocomplete="off"
            placeholder="***************"
            name="passwordInput"
            v-model="passwordInput"
            required
          />
        </div>
      </div>
      <div class="field">
        <label for="confirmInput" class="label">Confirm New Password</label>
        <div class="control">
          <input
            class="input"
            type="password"
            autocomplete="off"
            placeholder="***************"
            name="confirmInput"
            v-model="confirmInput"
            required
          />
        </div>
      </div>
      <PasswordStrengthMeter :input="passwordInput" />
      <button
        :disabled="!passwordInput || !confirmInput"
        v-if="!isLoading"
        class="button is-success mt-5"
      >
        Submit
      </button>
      <button
        v-if="isLoading"
        is-loading
        class="button is-loading is-success mt-5"
      >
        Submit
      </button>
    </form>
  </base-layout>
</template>

<script lang="ts">
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter.vue";
import { defineComponent, ref, onMounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { createChangePasswordMutation } from "../graphql/mutations/myMutations";
import gql from "graphql-tag";
import { ChangePasswordResponse, RootCommitType } from "@/types";
import { FetchResult } from "@apollo/client/core";
import { useToast } from "vue-toastification";
import auth from "../utils/AuthService";
import store from "../store";
export default defineComponent({
  name: "ChangePass",
  components: {
    PasswordStrengthMeter,
  },
  setup(this: void) {
    const toast = useToast();
    const isLoading = ref(false);
    const route = useRoute();
    const passwordInput = ref("");
    const confirmInput = ref("");
    const { mutate: submitChangePassword, onDone } = useMutation(
      gql`
        ${createChangePasswordMutation()}
      `,
      {
        variables: {
          password: passwordInput.value,
          token: route.params.token,
        },
      }
    );

    const verifyMatch = (pass: string, confirm: string): boolean => {
      if (pass === confirm) return true;
      else return false;
    };

    onDone(
      (
        result: FetchResult<
          ChangePasswordResponse,
          Record<string, unknown>,
          Record<string, unknown>
        >
      ): void => {
        console.log("what was the result", result.data);

        if (result.data?.changePassword?.errors?.length) {
          setTimeout(() => {
            isLoading.value = false;
          }, 1000);
          toast.error(result.data?.changePassword.errors[0].message, {
            timeout: 3000,
          });
        } else {
          // set logged in state and set the auth token
          auth.setToken(result.data?.changePassword?.token as string);
          store.commit("user/SET_LOGGED_IN" as RootCommitType, true, {
            root: true,
          });
          // set cards
          store.commit(
            "cards/SET_CARDS" as RootCommitType,
            result.data?.changePassword.cards,
            { root: true }
          );
          setTimeout(() => {
            isLoading.value = false;
            //to remove the password page from recent browser history of the current tab
          }, 2000);
          setTimeout(() => {
            window.location.replace("/");
          }, 1000);
          toast.success("Changed Password!", {
            timeout: 2000,
          });
        }
      }
    );

    onMounted(() => {
      document.title = "Change Password";
    });

    return {
      toast,
      verifyMatch,
      confirmInput,
      passwordInput,
      isLoading,
      route,
      submitChangePassword,
    };
  },
  methods: {
    readEvent(event: Event): void {
      console.log("submit event for changing password", event);
    },
  },
});
</script>
