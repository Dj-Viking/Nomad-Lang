
<template>
  <base-layout :isHome="false">
    <form class="field box" style="margin: 0 20%">
      <label class="mt-0 label">Username</label>
      <input class="mt-4 input" type="text" name="username" autocomplete="off" v-model="username"
        placeholder="Username" />
      <label class="mt-4 label">Email</label>
      <input class="mt-4 input" type="text" name="email" autocomplete="off" v-model="email"
        placeholder="example@mail.com" required />
      <label class="mt-4 label">Password</label>
      <input class="mt-4 input" type="password" name="password" v-model="password" placeholder="***************"
        required />
      <PasswordStrengthMeter :input="password" />
      <button :disabled="!username || !email || !password" v-if="!isLoading" class="button is-success mt-5"
        type="submit" @click.prevent="
          ($event) => {
            submitted = true;
            isLoading = true;
            readEvent($event);
            (async () => {
              await submitRegister({
                username,
                email,
                password,
              });
            })();
          }
        ">
        Sign Up!
      </button>
      <button v-if="isLoading" is-loading class="button is-loading is-success mt-5">
        spinner
      </button>
    </form>
  </base-layout>
</template>
<script lang="ts">
/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { defineComponent, onMounted, ref } from "vue";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter.vue";
import { RegisterResponse, RootCommitType, RootDispatchType } from "../types";
import auth from "../utils/AuthService";
import router from "../router";
import store from "../store";
import { useToast } from "vue-toastification";
import { api } from "@/utils/ApiService";
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
      submitted,
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
      // console.log("submitted", this.submitted);
    },
    async submitRegister(args: {
      username: string;
      email: string;
      password: string;
    }): Promise<void> {
      try {
        const { user, error } = (await api.signup(args)) as RegisterResponse;
        if (!!error) {
          throw new Error(`${error}`);
        }
        //user is defined
        auth.setToken(user!.token as string);
        // throw "unreachable";

        // set the user
        store.dispatch(
          "user/setUser" as RootDispatchType,
          { ...user },
          {
            root: true,
          }
        );
        // set the cards
        store.dispatch(
          "cards/setCards" as RootDispatchType,
          { cards: [] },
          {
            root: true,
          }
        );
        this.toast.success("Good luck have fun!", {
          timeout: 2000,
        });
        setTimeout(() => {
          // set login state true
          store.commit("user/SET_LOGGED_IN" as RootCommitType, true, {
            root: true,
          });
          this.submitted = false;
          this.isLoading = false;
          router.push("/");
        }, 3000);
      } catch (error) {
        console.error("error during the signup", error);
        this.submitted = false;
        this.isLoading = false;
        // @ts-ignore FIX ME provide better error message and standardize the error handling on front end
        this.toast.error(`Oops! error happened during signup ${error.error}`, {
          timeout: 3000,
        });
      }
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
