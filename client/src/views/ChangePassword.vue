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
            (async () => {
              await submitChangePassword({
                newPassword: passwordInput,
                resetToken: route.params.token as string || '',
              });
            })();
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
// import { ChangePasswordResponse, RootCommitType } from "@/types";
import { useToast } from "vue-toastification";
import auth from "@/utils/AuthService";
import { api } from "@/utils/ApiService";
import store from "@/store";
import router from "@/router";
import { RootCommitType, RootDispatchType } from "@/types";
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

    const verifyMatch = (pass: string, confirm: string): boolean => {
      if (pass === confirm) return true;
      else return false;
    };

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
    };
  },
  methods: {
    // eslint-disable-next-line
    readEvent(_event: Event): void {
      // do nothing
    },
    async submitChangePassword(args: {
      newPassword: string;
      resetToken: string;
    }): Promise<void> {
      try {
        const { resetToken, newPassword } = args;
        const { done, cards, token, error } = await api.changePassword(
          resetToken,
          newPassword
        );

        if (!!error || !done) throw error;

        //log in the user
        store.commit("user/SET_LOGGED_IN" as RootCommitType, true, {
          root: true,
        });
        auth.setToken(token as string);
        // set the cards
        await store.dispatch(
          "cards/setCards" as RootDispatchType,
          { cards },
          { root: true }
        );
        // display success and route to home page
        this.toast.success(
          "Successfully changed password, good luck and have fun!",
          { timeout: 3000 }
        );
        setTimeout(() => {
          this.isLoading = false;
          router.push("/");
        }, 3000);
      } catch (error) {
        this.isLoading = false;
        console.error(error);
        const err = error as Error;
        this.toast.error(err.message, {
          timeout: 3000,
        });
      }
    },
  },
});
</script>
