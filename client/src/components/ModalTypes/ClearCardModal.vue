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
import { defineComponent, computed } from "vue";
import { api } from "../../utils/ApiService";
import auth from "../../utils/AuthService";
import { MyRootState, RootCommitType, RootDispatchType } from "../../types";
import { useStore } from "vuex";
export default defineComponent({
  name: "ClearCardModal",
  props: {
    title: String,
  },
  setup() {
    const store = useStore<MyRootState>();
    const isLoggedIn = computed(() => store.state.user.user.loggedIn);
    return {
      isLoggedIn,
      store
    };
  },
  methods: {
    // eslint-disable-next-line
    async confirmClearButtonEvent(_event: any): Promise<void> {
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
      await this.store.dispatch(
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
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
  }
});
</script>

<style lang="scss">
</style>