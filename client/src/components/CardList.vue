<template>
  <div class="container some-unique-class">
    <button
      class="button is-info"
      @click.prevent="
        ($event) => {
          //clear local cards
          clearCards($event);
          if (isLoggedIn) {
            submitClearUserCards();
          }
        }
      "
    >
      clear cards
    </button>
    <div style="margin-top: 2em; margin-bottom: 2em">
      <div class="control">
        <button
          @click.prevent="openAddModal($event)"
          class="button is-info mt-3"
          type="submit"
          style="color: rgb(255, 255, 255)"
        >
          Add New Card
        </button>
      </div>
    </div>
    <Transition>
      <div class="container is-widescreen" v-if="cards.length > 0">
        <h2 class="title">Your Cards</h2>
        <div
          style="margin-bottom: 0"
          class="notification is-light"
          v-for="(card, i) in cards"
          :key="i"
        >
          <Card :card="card" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import {
  // AddCardResponse,
  // EditCardModalContext,
  RootCommitType,
  RootDispatchType,
  CardsState,
  UserState,
  LoadingState,
} from "../types";
import { ref, defineComponent } from "vue";
import store from "../store";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { createClearUserCardsMutation } from "../graphql/mutations/myMutations";

import Card from "../components/Card.vue";
// import Spinner from "../components/Spinner.vue";

export default defineComponent({
  name: "CardList",
  components: {
    Card,
    // Spinner,
  },
  setup() {
    const inputId = ref(0);
    const input = ref("");

    const { mutate: submitClearUserCards } = useMutation(
      gql`
        ${createClearUserCardsMutation()}
      `
    );

    return {
      input,
      inputId,
      submitClearUserCards,
    };
  },
  data() {
    return {
      inputText: "",
      store: store,
    };
  },
  computed: {
    cards: (): CardsState["cards"] => store.state.cards.cards,
    isLoggedIn: (): UserState["user"]["loggedIn"] =>
      store.state.user.user.loggedIn,
    activeClass: () => store.state.modal.modal.activeClass,
    isLoading: (): LoadingState["loading"]["isLoading"] =>
      store.state.loading.loading.isLoading,
  },
  methods: {
    readInputEvent(event: Event) {
      console.log("add card event", event);
    },

    // eslint-disable-next-line
    clearCards(_event: Event): void {
      store.commit("cards/SET_CARDS" as RootCommitType, [], { root: true });
    },
    // eslint-disable-next-line
    async addCard(_event: Event): Promise<void | boolean> {
      if (!this.inputText) return;
      const payload = {
        id: Date.now(),
        text: this.inputText,
        color: "blue",
      };
      const addResponse: boolean = await store.dispatch(
        "cards/addCard" as RootDispatchType,
        payload,
        {
          root: true,
        }
      );
      this.inputText = "";
      return addResponse;
    },
    openAddModal(event: MouseEvent): void {
      console.log("open add modal click event", event);
      //set modal title
      store.commit("modal/SET_MODAL_TITLE", "Add a new Card", {
        root: true,
      });
      // open the modal
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.some-unique-class {
  margin-top: 1px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity height 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  height: 0;
}
</style>
