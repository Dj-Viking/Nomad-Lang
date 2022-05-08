<template>
  <div>
    <form
      id="add-card-form"
      @submit.prevent="
        ($event) => {
          //update local state with the extra propertiesa 'front' and 'back' sides
          // also if not logged in create an ID as Date.now()
      
          if (isLoggedIn) {
            //graphql mutation pass data to the modal for it to use.
            const card = {
              frontSideText: frontSideTextInput || '',
              frontSideLanguage: frontSideLanguageInput || '',
              frontSidePicture: frontSidePictureInput || '',
              backSideText: backSideTextInput || '',
              backSideLanguage: backSideLanguageInput || '',
              backSidePicture: backSidePictureInput || '',
            };
            (async () => {
              //@ts-ignore something is wrong with vue language server...this card is in scope....
              await submitAddCard($event, card);
            })();
            clearCardInputFields();
            closeModal();
          } else {
            const offlineCard = {
              _id: keyGen(), //ids must be unique
              frontSideText: frontSideTextInput,
              frontSideLanguage: frontSideLanguageInput,
              frontSidePicture: frontSidePictureInput,
              backSideText: backSideTextInput,
              backSideLanguage: backSideLanguageInput,
              backSidePicture: backSidePictureInput,
              creatorId: 0,
              isFrontSide: true,
              isBackSide: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            (async () => {
              //@ts-ignore
              await addLocalCard($event, offlineCard);
            })()
            clearCardInputFields();
            closeModal();
          }
        }
      "
    >
      <div class="field">
        <label
          for="inputText"
          style="color: white"
          class="label"
        >{{ title }}
        </label>
      </div>
      <div class="field">
        <label
          style="color: white"
          class="label"
          for="modalAddFsText"
        >Front Side Text
        </label>
        <div class="control">
          <input
            id="fs-text-input"
            autocomplete="off"
            name="modalAddFsText"
            type="text"
            class="input"
            v-model="frontSideTextInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          class="label"
          style="color: white"
          for="modalAddFsTextLanguage"
        >
          Front Side Text Language
        </label>
        <div class="control">
          <input
            id="fs-language-input"
            autocomplete="off"
            name="modalAddFsTextLanguage"
            type="text"
            class="input"
            v-model="frontSideLanguageInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          style="color: white"
          for="modalAddFsTextPicture"
          class="label"
        >
          Front Side Picture</label>
        <div class="control">
          <input
            id="fs-picture-input"
            autocomplete="off"
            name="modalAddFsTextPicture"
            type="text"
            class="input"
            v-model="frontSidePictureInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          style="color: white"
          for="modalAddBsText"
          class="label"
        >
          Back Side Text
        </label>
        <div class="control">
          <input
            id="bs-text-input"
            autocomplete="off"
            name="modalAddBsText"
            type="text"
            class="input"
            v-model="backSideTextInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          style="color: white"
          for="modalAddBsTextLanguage"
          class="label"
        >Back Side Text Language</label>
        <div class="control">
          <input
            id="bs-language-input"
            autocomplete="off"
            name="modalAddBsTextLanguage"
            type="text"
            class="input"
            v-model="backSideLanguageInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          style="color: white"
          for="modalAddBsTextPicture"
          class="label"
        >Back Side Picture</label>
        <div class="control">
          <input
            id="bs-picture-input"
            autocomplete="off"
            name="modalAddBsTextPicture"
            type="text"
            class="input"
            v-model="backSidePictureInput"
          />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button
            id="add-card-submit"
            name="submitAddCard"
            type="submit"
            class="button is-info"
          >
            SUBMIT ADD CARD
          </button>
          <span
            v-if="showErrMsg"
            class="has-text-danger"
          >Error {{ errMsg }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import store from "../../store";
import { AddCardPayload, AddCardResponse, MyRootState, RootCommitType, RootDispatchType } from "../../types";
import { api } from "../../utils/ApiService";
import auth from "../../utils/AuthService";
import { useToast } from "vue-toastification";
import { keyGen } from "../../utils/keyGen";
export default defineComponent({
  name: "AddCardModal",
  props: {
    title: String
  },
  setup() {
    const toast = useToast();
    const store = useStore<MyRootState>();
    const errMsg = ref("");
    const showErrMsg = ref(false);
    const frontSideTextInput = ref("");
    const frontSideLanguageInput = ref("");
    const frontSidePictureInput = ref("");
    const backSideTextInput = ref("");
    const backSideLanguageInput = ref("");
    const backSidePictureInput = ref("");
    const cards = computed(() => store.state.cards.allCards);
    const isLoggedIn = computed(() => store.state.user.user.loggedIn);
    return {
      isLoggedIn,
      cards,
      toast,
      keyGen,
      store,
      errMsg,
      showErrMsg,
      frontSideTextInput,
      frontSideLanguageInput,
      frontSidePictureInput,
      backSideTextInput,
      backSideLanguageInput,
      backSidePictureInput,
    };
  },
  methods: {
    async submitAddCard(_event: any, card: AddCardPayload): Promise<void> {
      try {
        console.log("got card", card, "event of submitting the card", _event);
        const { cards, error } = (await api.addCard(
          auth.getToken() as string,
          card
        )) as AddCardResponse;
        if (!!error) {
          console.error(error);
        }
        this.clearCardInputFields();

        console.log("add card response hopefully cards", cards);
        // set cards
        this.store.dispatch(
          "cards/setCards" as RootDispatchType,
          { cards },
          { root: true }
        );
      } catch (error) {
        console.error("error when submitting card", error);
        this.toast.error(`error when submitting card ${error}`, {
          timeout: 3000,
        });
      }
    },
    // eslint-disable-next-line
    closeModal(_event?: Event): void {
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
    clearCardInputFields(): void {
      this.frontSideTextInput = "";
      this.frontSideLanguageInput = "";
      this.frontSidePictureInput = "";
      this.backSideTextInput = "";
      this.backSideLanguageInput = "";
      this.backSidePictureInput = "";
    },
    // eslint-disable-next-line
    async addLocalCard(_event: Event, card: AddCardPayload): Promise<void> {
      console.log("card", card);
      await store.dispatch("cards/setCards" as RootDispatchType,
        { cards: [...this.cards, card] },
        { root: true });
    },
  }
});
</script>

<style lang="scss">
</style>