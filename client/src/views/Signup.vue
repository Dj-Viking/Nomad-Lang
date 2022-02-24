<template>
  <base-layout :isHome="false">
    <form
      class="field box"
      style="margin: 0 20%"
      @submit.prevent="
        ($event) => {
          let event = $event;
          readEvent(event);
          // submitRegister({
          //   options: {
          //     email,
          //     username,
          //     password,
          //   },
          // });
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
      <PasswordStrengthMeter :input="password" />
      <button
        :disabled="!username || !email || !password"
        v-if="!isLoading"
        class="button is-success mt-5"
      >
        Sign Up!
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
import { defineComponent, onMounted, ref } from "vue";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter.vue";
// import { RegisterResponse, RootCommitType } from "../types";
// import auth from "../utils/AuthService";
// import router from "../router";
// import store from "../store";
import { useToast } from "vue-toastification";
// for some reason the value property is not on the default Event type
export default defineComponent({
  name: "Signup",
  components: {
    PasswordStrengthMeter,
  },
  setup(this: void) {
    const toast = useToast();
    const email = ref("");
    const username = ref("");
    const password = ref("");
    const submitted = ref(false);
    const isLoading = ref(false);

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
      email,
      toast,
      username,
      password,
      isLoading,
    };
  },
  methods: {
    //to make the ts check compiler happy
    // eslint-disable-next-line
    readEvent(_event: Event): void {
      // do nothing
    },
    // eslint-disable-next-line
    // 
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
