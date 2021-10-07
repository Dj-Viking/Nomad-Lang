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
    <div class="container is-widescreen" v-if="cards.length > 0">
      <h3>Your Cards</h3>
      <div class="notification is-light" v-for="(card, i) in cards" :key="i">
        <div :style="`color: ${card.color}`">
          <pre name="cardInfo">{{ card }}</pre>
          <span style="color: blue">updated at: {{ card.updatedAt }}</span>
        </div>
        <button
          class="button is-danger mx-2"
          @click.prevent="
            ($event) => {
              //update vuex cards that are displayed
              deleteCard($event, card?.id);
              //only delete user's cards if they are logged in
              if (isLoggedIn) {
                submitDeleteCard({
                  id: card.id,
                });
              }
            }
          "
        >
          delete card
        </button>
        <button
          class="button is-primary mx-2"
          style="color: black"
          @click.prevent="
            ($event) => {
              openEditModal($event, card);
            }
          "
        >
          Edit Card
        </button>
      </div>
    </div>
    <div v-else>
      <span>no cards to display...</span>
    </div>

    <div style="margin-top: 100px">
      <div class="control">
        <button
          @click.prevent="openAddModal($event)"
          class="button is-info mt-3"
          type="submit"
        >
          Add New Card
        </button>
      </div>
    </div>
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
} from "../types";
import { ref, defineComponent } from "vue";
import store from "../store";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import {
  // createAddCardMutation,
  createDeleteCardMutation,
  createClearUserCardsMutation,
  // createEditCardMutation,
} from "../graphql/mutations/myMutations";
// import { FetchResult } from "@apollo/client/core";
import { Card } from "../types";
import { useToast } from "vue-toastification";
// import { Store } from "vuex";

export default defineComponent({
  name: "CardList",
  setup(this: void) {
    const toast = useToast();
    const inputId = ref(0);
    const input = ref("");
    const errMsg = ref("");
    const successMsg = ref("");
    const showSuccess = ref(false);
    const showError = ref(false);

    const { mutate: submitDeleteCard } = useMutation(
      gql`
        ${createDeleteCardMutation()}
      `,
      {
        variables: {
          //using a ref as a type definition of the input that will happen later
          id: inputId.value,
        },
      }
    );
    const { mutate: submitClearUserCards } = useMutation(
      gql`
        ${createClearUserCardsMutation()}
      `
    );

    return {
      input,
      submitClearUserCards,
      inputId,
      submitDeleteCard,
      showError,
      showSuccess,
      errMsg,
      successMsg,
      toast,
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
  },
  methods: {
    readInputEvent(event: Event) {
      console.log("add card event", event);
    },
    async deleteCard(_event: Event, index: number): Promise<void> {
      await store.dispatch("cards/deleteCard" as RootDispatchType, index, {
        root: true,
      });
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
    openEditModal(event: Event, card: Card) {
      console.log(
        "able to get id in this loop to also open the modal?????",
        card
      );
      console.log("open modal from card list", event);
      //adding to element classlist under the hood
      store.commit("modal/SET_MODAL_TITLE", "Edit a card", {
        root: true,
      });
      // const payload: EditCardModalContext = {
      //   card,
      // };
      store.commit("modal/SET_MODAL_CONTEXT" as RootCommitType, card, {
        root: true,
      });
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
    // eslint-disable-next-line
    textInput(event: any): void {
      this.inputText = event.target.value as string;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.some-unique-class {
  margin-top: 1px;
}
</style>
