<template>
  <div class="field">
    <label
      for="inputText"
      style="color: white"
      class="label"
    >{{ title }}
    </label>
  </div>
  <label
    style="color: white"
    class="label"
  >Are you sure you want to clear your cards? This cannot be undone!
    (yet)</label>
  <button
    style="margin-right: 1em; width: 100px"
    class="button is-info"
    type="button"
    @click.prevent="
      ($event) => {
        confirmClearButtonEvent($event);
        if (isLoggedIn) {
          submitClearUserCards();
        }
      }
    "
  >
    Yes
  </button>
  <button
    style="margin-right: 1em; width: 100px"
    class="button is-info"
    type="button"
    @click.prevent="
      ($event) => {
        cancelClearButtonEvent($event);
      }
    "
  >
    No
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "../../store";
import { api } from "../../utils/ApiService";
import auth from "../../utils/AuthService";
import { RootCommitType, RootDispatchType, UserState } from "../../types";
export default defineComponent({
  name: "ClearCardModal",
  props: {
    title: String,
  },
  computed: {
    isLoggedIn: (): UserState["user"]["loggedIn"] =>
      store.state.user.user.loggedIn,
  },
  methods: {
    // eslint-disable-next-line
    async confirmClearButtonEvent(_event: any): Promise<void> {
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
      await store.dispatch(
        "cards/setCards" as RootDispatchType,
        { cards: [] },
        { root: true }
      );
    },
    async submitClearUserCards() {
      try {
        const { user, error } = await api.clearCards(auth.getToken() as string);
        console.log("res from clear cards", user);
        console.log("error from clear cards", error);
      } catch (error) {
        console.error(error);
        return;
      }
    },
    // eslint-disable-next-line
    cancelClearButtonEvent(_event: any): void {
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
  }
});
</script>

<style lang="scss">
</style>