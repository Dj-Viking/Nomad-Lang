<template>
  <div :class="{ 'is-active': activeClass }" class="modal" name="modal">
    <div class="modal-background"></div>
    <div class="modal-content" style="width: 75%">
      <div v-if="/Clear/g.test(title)">
        <div class="field">
          <label for="inputText" style="color: white" class="label"
            >{{ title }}
          </label>
        </div>
        <label style="color: white" class="label"
          >Are you sure you want to clear your cards? This cannot be undone!
          (yet)</label
        >
        <button
          style="margin-right: 1em; width: 100px"
          class="button is-info"
          type="button"
          @click.prevent="
            ($event) => {
              confirmClearButtonEvent($event);
              if (isLoggedIn) {
                // submitClearUserCards();
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
      </div>
      <div v-if="/Edit/g.test(title)">
        <form
          @submit.prevent="
            ($event) => {
              if (isLoggedIn) {
                //graphql mutation pass data to the modal for it to use.
                // const payload = {
                //   options: {
                //     id: modalContext.card?._id,
                //     frontSideText:
                //       frontSideTextInput || modalContext.card?.frontSideText,
                //     frontSideLanguage:
                //       frontSideLanguageInput ||
                //       modalContext.card?.frontSideLanguage,
                //     frontSidePicture:
                //       frontSidePictureInput ||
                //       modalContext.card?.frontSidePicture,
                //     backSideText:
                //       backSideTextInput || modalContext.card?.backSideText,
                //     backSideLanguage:
                //       backSideLanguageInput ||
                //       modalContext.card?.backSideLanguage,
                //     backSidePicture:
                //       backSidePictureInput ||
                //       modalContext.card?.backSidePicture,
                //   },
                // };
                // submitEditCard(payload);
                // editLocalCard($event, payload.options);
                clearCardInputFields();
                closeModal();
              } else {
                const card = {
                  id: modalContext.card?._id,
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
                editLocalCard($event, card);
                clearCardInputFields();
                closeModal();
              }
            }
          "
        >
          <div class="field">
            <label for="inputText" style="color: white" class="label"
              >{{ title }}
            </label>
          </div>
          <div class="field">
            <label style="color: white" class="label" for="modalEditFsText"
              >Front Side Text
            </label>
            <div class="control">
              <input
                autocomplete="off"
                name="modalEditFsText"
                type="text"
                class="input"
                :placeholder="modalContext.card.frontSideText"
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
                :placeholder="modalContext.card.frontSideLanguage"
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
              Front Side Picture</label
            >
            <div class="control">
              <input
                autocomplete="off"
                name="modalEditFsTextPicture"
                type="text"
                class="input"
                :placeholder="modalContext.card.frontSidePicture"
                v-model="frontSidePictureInput"
              />
            </div>
          </div>
          <div class="field">
            <label style="color: white" for="modalEditBsText" class="label">
              Back Side Text
            </label>
            <div class="control">
              <input
                autocomplete="off"
                name="modalEditBsText"
                type="text"
                class="input"
                :placeholder="modalContext.card.backSideText"
                v-model="backSideTextInput"
              />
            </div>
          </div>
          <div class="field">
            <label
              style="color: white"
              for="modalEditBsTextLanguage"
              class="label"
              >Back Side Text Language</label
            >
            <div class="control">
              <input
                autocomplete="off"
                name="modalEditBsTextLanguage"
                type="text"
                class="input"
                :placeholder="modalContext.card.backSideLanguage"
                v-model="backSideLanguageInput"
              />
            </div>
          </div>
          <div class="field">
            <label
              style="color: white"
              for="modalEditBsTextPicture"
              class="label"
              >Back Side Picture</label
            >
            <div class="control">
              <input
                autocomplete="off"
                name="modalEditBsTextPicture"
                type="text"
                class="input"
                :placeholder="modalContext.card.backSidePicture"
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
              <span v-if="showErrMsg" class="has-text-danger"
                >Error {{ errMsg }}</span
              >
            </div>
          </div>
        </form>
      </div>
      <div v-if="/Add/g.test(title)">
        <form
          @submit.prevent="
            ($event) => {
              //update local state with the extra propertiesa 'front' and 'back' sides
              // also if not logged in create an ID as Date.now()

              if (isLoggedIn) {
                //graphql mutation pass data to the modal for it to use.
                // const card = {
                //   options: {
                //     frontSideText: frontSideTextInput || '',
                //     frontSideLanguage: frontSideLanguageInput || '',
                //     frontSidePicture: frontSidePictureInput || '',
                //     backSideText: backSideTextInput || '',
                //     backSideLanguage: backSideLanguageInput || '',
                //     backSidePicture: backSidePictureInput || '',
                //   },
                // };
                // submitAddCard(card);
                // addLocalCard($event, card.options);
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
                addLocalCard($event, offlineCard);
                clearCardInputFields();
                closeModal();
              }
            }
          "
        >
          <div class="field">
            <label for="inputText" style="color: white" class="label"
              >{{ title }}
            </label>
          </div>
          <div class="field">
            <label style="color: white" class="label" for="modalAddFsText"
              >Front Side Text
            </label>
            <div class="control">
              <input
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
              Front Side Picture</label
            >
            <div class="control">
              <input
                autocomplete="off"
                name="modalAddFsTextPicture"
                type="text"
                class="input"
                v-model="frontSidePictureInput"
              />
            </div>
          </div>
          <div class="field">
            <label style="color: white" for="modalAddBsText" class="label">
              Back Side Text
            </label>
            <div class="control">
              <input
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
              >Back Side Text Language</label
            >
            <div class="control">
              <input
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
              >Back Side Picture</label
            >
            <div class="control">
              <input
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
              <button name="submitAddCard" type="submit" class="button is-info">
                SUBMIT ADD CARD
              </button>
              <span v-if="showErrMsg" class="has-text-danger"
                >Error {{ errMsg }}</span
              >
            </div>
          </div>
        </form>
      </div>
    </div>
    <button
      @click.prevent="closeModal($event)"
      class="modal-close is-large"
      aria-label="close"
    ></button>
  </div>
</template>

<script lang="ts">
import {
  ModalState,
  RootCommitType,
  UserState,
  ICard,
  EditCardCommitPayload,
  RootDispatchType,
  MyRootState,
} from "@/types";
import { defineComponent, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { keyGen } from "@/utils/keyGen";
import { useToast } from "vue-toastification";
import store from "../store";
export default defineComponent({
  name: "Modal",
  setup() {
    const store = useStore<MyRootState>();
    const toast = useToast();
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
    const errMsg = ref("");
    const showErrMsg = ref(false);

    return {
      frontSideTextInput,
      frontSideLanguageInput,
      frontSidePictureInput,
      backSideTextInput,
      backSideLanguageInput,
      backSidePictureInput,
      keyGen,
      errMsg,
      toast,
      showErrMsg,
    };
  },
  computed: {
    title: (): ModalState["modal"]["title"] => store.state.modal.modal.title,
    activeClass: (): ModalState["modal"]["activeClass"] =>
      store.state.modal.modal.activeClass,
    isLoggedIn: (): UserState["user"]["loggedIn"] =>
      store.state.user.user.loggedIn,
    modalContext: (): ModalState["modal"]["context"] =>
      store.state.modal.modal.context,
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
    // eslint-disable-next-line
    cancelClearButtonEvent(_event: any): void {
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
    // eslint-disable-next-line
    addLocalCard(_event: Event, card: ICard): void {
      store.commit("cards/ADD_CARD" as RootCommitType, card, { root: true });
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
    closeModal(_event?: Event): void {
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
    //
    editLocalCard(_event: Event, card: EditCardCommitPayload): void {
      store.commit("cards/EDIT_CARD" as RootCommitType, card, {
        root: true,
      });
    },
    closeModalViaEsc(): void {
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
  },
  created: function (): void {
    document.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        this.closeModalViaEsc();
      } else return;
    });
  },
  unmounted: function (): void {
    document.removeEventListener("keyup", this.closeModalViaEsc);
  },
});
</script>

<style lang="scss"></style>
