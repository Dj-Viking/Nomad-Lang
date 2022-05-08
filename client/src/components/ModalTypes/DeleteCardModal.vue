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
  >Are you sure you want to delete this card? This cannot be undone!
    (yet)</label>
  <button
    style="margin-right: 1em; width: 100px"
    class="button is-info"
    type="button"
    id="delete-yes"
    @click.prevent="
      ($event) => {
        confirmDeleteButtonEvent($event, id!);
        if (isLoggedIn) {
          submitDeleteCard($event, id!);
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
    id="delete-no"
    @click.prevent="
      ($event) => {
        cancelDeleteButtonEvent($event);
      }
    "
  >
    No
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import auth from "../../utils/AuthService";
import { api } from "../../utils/ApiService";
import { MyRootState, RootCommitType, RootDispatchType } from "../../types";
import { useToast } from "vue-toastification";
export default defineComponent({
  name: "DeleteCardModal",
  props: {
    title: String,
    id: String
  },
  setup() {
    const store = useStore<MyRootState>();
    const toast = useToast();
    const isLoggedIn = computed(() => store.state.user.user.loggedIn);
    return {
      isLoggedIn,
      toast,
      store
    };
  },
  methods: {
    // eslint-disable-next-line
    confirmDeleteButtonEvent(_event: any, id: string): void {
      this.store.commit("cards/DELETE_CARD" as RootCommitType, id, { root: true });
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, { root: true });
    },
    // eslint-disable-next-line
    cancelDeleteButtonEvent(_event: any): void {
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, { root: true });
    },
    async deleteCard(_event: Event, id: string): Promise<void> {
      await this.store.dispatch("cards/deleteCard" as RootDispatchType, id, {
        root: true,
      });
    },
    async submitDeleteCard(_event: any, id: string): Promise<void> {
      try {
        const { cards, error } = await api.deleteCard(
          auth.getToken() as string,
          id
        );
        if (!!error) throw error;
        console.log("cards returned from api after deleting", cards);
      } catch (error) {
        this.toast.error(`error during submitting delete card: ${error}`, {
          timeout: 3000,
        });
        console.error(error);
      }
    },
  }
});
</script>

<style lang="scss">
</style>