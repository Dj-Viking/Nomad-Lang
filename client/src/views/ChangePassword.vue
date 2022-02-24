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
            // submitChangePassword({
            //   password: passwordInput,
            //   token: route.params.token || '',
            // });
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
// import auth from "../utils/AuthService";
// import store from "../store";
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
  },
});
</script>
