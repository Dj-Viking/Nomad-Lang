<template>
  <div>
    <form @submit.prevent="
      ($event) => {
        if (isLoggedIn) {
          const _card = {
            id: card?._id,
            frontSideText:
              frontSideTextInput || card?.frontSideText,
            frontSideLanguage:
              frontSideLanguageInput ||
              card?.frontSideLanguage,
            frontSidePicture:
              frontSidePictureInput ||
              card?.frontSidePicture,
            backSideText:
              backSideTextInput || card?.backSideText,
            backSideLanguage:
              backSideLanguageInput ||
              card?.backSideLanguage,
            backSidePicture:
              backSidePictureInput || card?.backSidePicture,
          };
          if (isLoggedIn) {
            (async () => {
              //@ts-ignore
              submitEditCard(_card);
            })();
          }
          //@ts-ignore
          editLocalCard($event, _card);
          clearCardInputFields();
          closeModal();
        } else {
          const _card = {
            id: card?._id,
            frontSideText: frontSideTextInput,
            frontSideLanguage: frontSideLanguageInput,
            frontSidePicture: frontSidePictureInput,
            backSideText: backSideTextInput,
            backSideLanguage: backSideLanguageInput,
            backSidePicture: backSidePictureInput,
            creatorId: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          //@ts-ignore
          editLocalCard($event, _card);
          clearCardInputFields();
          closeModal();
        }
      }
    ">
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
          for="modalEditFsText"
        >Front Side Text
        </label>
        <div class="control">
          <input
            autocomplete="off"
            name="modalEditFsText"
            type="text"
            class="input"
            :placeholder="card.frontSideText"
            v-model="frontSideTextInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          class="label"
          style="color: white"
          for="modalEditFsTextLanguage"
        >
          Front Side Text Language
        </label>
        <div class="control">
          <input
            autocomplete="off"
            name="modalEditFsTextLanguage"
            type="text"
            class="input"
            :placeholder="card.frontSideLanguage"
            v-model="frontSideLanguageInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          style="color: white"
          for="modalEditFsTextPicture"
          class="label"
        >
          Front Side Picture</label>
        <div class="control">
          <input
            autocomplete="off"
            name="modalEditFsTextPicture"
            type="text"
            class="input"
            :placeholder="card.frontSidePicture"
            v-model="frontSidePictureInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          style="color: white"
          for="modalEditBsText"
          class="label"
        >
          Back Side Text
        </label>
        <div class="control">
          <input
            autocomplete="off"
            name="modalEditBsText"
            type="text"
            class="input"
            :placeholder="card.backSideText"
            v-model="backSideTextInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          style="color: white"
          for="modalEditBsTextLanguage"
          class="label"
        >Back Side Text Language</label>
        <div class="control">
          <input
            autocomplete="off"
            name="modalEditBsTextLanguage"
            type="text"
            class="input"
            :placeholder="card.backSideLanguage"
            v-model="backSideLanguageInput"
          />
        </div>
      </div>
      <div class="field">
        <label
          style="color: white"
          for="modalEditBsTextPicture"
          class="label"
        >Back Side Picture</label>
        <div class="control">
          <input
            autocomplete="off"
            name="modalEditBsTextPicture"
            type="text"
            class="input"
            :placeholder="card.backSidePicture"
            v-model="backSidePictureInput"
          />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button
            name="submitEditCard"
            type="submit"
            class="button is-info"
          >
            SUBMIT EDIT CARD
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
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import store from "../../store";
import auth from "../../utils/AuthService";
import { CardClass, EditCardCommitPayload, IEditCardPayload, MyRootState, RootCommitType, UserState } from "../../types";
import { api } from "../../utils/ApiService";
export default defineComponent({
  name: "EditCardModal",
  props: {
    title: String,
    card: CardClass
  },
  computed: {
    isLoggedIn: (): UserState["user"]["loggedIn"] =>
      store.state.user.user.loggedIn,
  },
  setup() {
    const store = useStore<MyRootState>();
    const errMsg = ref("");
    const showErrMsg = ref(false);

    const frontSideTextInput = ref(
      store.state.modal.modal.context.card.frontSideText as any
    );
    const frontSideLanguageInput = ref(
      store.state.modal.modal.context.card.frontSideLanguage as any
    );
    const frontSidePictureInput = ref(
      store.state.modal.modal.context.card.frontSidePicture as any
    );
    const backSideTextInput = ref(
      store.state.modal.modal.context.card.backSideText as any
    );
    const backSideLanguageInput = ref(
      store.state.modal.modal.context.card.backSideLanguage as any
    );
    const backSidePictureInput = ref(
      store.state.modal.modal.context.card.backSidePicture as any
    );
    return {
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
    async submitEditCard(card: IEditCardPayload): Promise<void> {
      console.log("card in edit", card);
      try {
        const { error } = await api.editCard(auth.getToken() as string, card);
        if (!!error) throw error;
      } catch (error) {
        this.toast.error(`error when editing a card: ${error}`);
      }
    },
    editLocalCard(_event: Event, card: EditCardCommitPayload): void {
      store.commit("cards/EDIT_CARD" as RootCommitType, card, {
        root: true,
      });
      this.clearCardInputFields();
    },
  }
});
</script>

<style lang="scss">
</style>