<template>
  <base-layout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%; margin-top: 2em"
      @submit.prevent="
        ($event) => {
          readEvent($event);
          isLoading = true;
          // submitForgotPassword({
          //   email: emailInput,
          // });
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
    // eslint-disable-next-line
    readEvent(_event: Event) {
      // do nothing
    },
  },
});
</script>
