<template>
  <div :class="{ 'is-active': activeClass }" class="modal" name="modal">
    <div class="modal-background"></div>
    <div class="modal-content" style="width: 75%">
      <div v-if="/Edit/g.test(title)">
        <form
          @submit.prevent="
            ($event) => {
              if (isLoggedIn) {
                //graphql mutation pass data to the modal for it to use.
                const payload = {
                  options: {
                    id: modalContext.card?.id,
                    frontSideText:
                      frontSideTextInput || modalContext.card?.frontSideText,
                    frontSideLanguage:
                      frontSideLanguageInput ||
                      modalContext.card?.frontSideLanguage,
                    frontSidePicture:
                      frontSidePictureInput ||
                      modalContext.card?.frontSidePicture,
                    backSideText:
                      backSideTextInput || modalContext.card?.backSideText,
                    backSideLanguage:
                      backSideLanguageInput ||
                      modalContext.card?.backSideLanguage,
                    backSidePicture:
                      backSidePictureInput ||
                      modalContext.card?.backSidePicture,
                  },
                };
                submitEditCard(payload);
                // editLocalCard($event, payload.options);
                clearCardInputFields();
                closeModal();
              } else {
                const card = {
                  id: modalContext.card?.id,
                  frontSideText: frontSideTextInput,
                  frontSideLanguage: frontSideLanguageInput,
                  frontSidePicture: frontSidePictureInput,
                  backSideText: backSideTextInput,
                  backSideLanguage: backSideLanguageInput,
                  backSidePicture: backSidePictureInput,
                  color: 'blue',
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
              if (isLoggedIn) {
                //graphql mutation pass data to the modal for it to use.
                const card = {
                  options: {
                    frontSideText: frontSideTextInput || '',
                    frontSideLanguage: frontSideLanguageInput || '',
                    frontSidePicture: frontSidePictureInput || '',
                    backSideText: backSideTextInput || '',
                    backSideLanguage: backSideLanguageInput || '',
                    backSidePicture: backSidePictureInput || '',
                  },
                };
                submitAddCard(card);
                // addLocalCard($event, card.options);
                clearCardInputFields();
                closeModal();
              } else {
                const card = {
                  id: 0, //ids must be unique
                  frontSideText: frontSideTextInput,
                  frontSideLanguage: frontSideLanguageInput,
                  frontSidePicture: frontSidePictureInput,
                  backSideText: backSideTextInput,
                  backSideLanguage: backSideLanguageInput,
                  backSidePicture: backSidePictureInput,
                  color: 'blue',
                  creatorId: 0,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                };
                addLocalCard($event, card);
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
      <div v-else>
        <h3 style="color: white">{{ title }}</h3>
        <p style="color: white">something else</p>
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
  createEditCardMutation,
  createAddCardMutation,
} from "@/graphql/mutations/myMutations";
import {
  ModalState,
  RootCommitType,
  UserState,
  EditCardResponse,
  ICard,
  AddCardResponse,
  EditCardCommitPayload,
} from "@/types";
import { FetchResult } from "@apollo/client/core";
import { useMutation } from "@vue/apollo-composable";
import { defineComponent, ref } from "@vue/runtime-core";
import { gql } from "graphql-tag";
import { useToast } from "vue-toastification";
import store from "../store";
export default defineComponent({
  name: "Modal",
  setup() {
    const toast = useToast();
    const frontSideTextInput = ref();
    const frontSideLanguageInput = ref();
    const frontSidePictureInput = ref();
    const backSideTextInput = ref();
    const backSideLanguageInput = ref();
    const backSidePictureInput = ref();
    const inputId = ref(0);
    const errMsg = ref("");
    const showErrMsg = ref(false);
    const editResponse = ref();
    const { mutate: submitAddCard, onDone: onAddCardDone } = useMutation(
      gql`
        ${createAddCardMutation()}
      `,
      {
        variables: {
          options: {
            frontSideText: frontSideTextInput.value,
            frontSideLanguage: frontSideLanguageInput.value,
            frontSidePicture: frontSidePictureInput.value,
            backSideText: backSideTextInput.value,
            backSideLanguage: backSideLanguageInput.value,
            backSidePicture: backSidePictureInput.value,
          },
        },
      }
    );

    onAddCardDone(
      (
        result: FetchResult<
          AddCardResponse,
          Record<string, unknown>,
          Record<string, unknown>
        >
      ): void => {
        if (result.data?.addCard.errors) {
          toast.error(
            `Error: there was an error adding a card - ${result.data?.addCard.errors[0].message}`,
            {
              timeout: 3000,
            }
          );
        } else {
          toast.success("Success: added a card to your list!", {
            timeout: 3000,
          });
          store.commit(
            "cards/SET_CARDS" as RootCommitType,
            result.data?.addCard.cards,
            {
              root: true,
            }
          );
        }
      }
    );

    const { mutate: submitEditCard, onDone: onEditCardDone } = useMutation(
      gql`
        ${createEditCardMutation()}
      `,
      {
        variables: {
          options: {
            id: inputId.value,
            frontSideText: frontSideTextInput.value,
            frontSideLanguage: frontSideLanguageInput.value,
            frontSidePicture: frontSidePictureInput.value,
            backSideText: backSideTextInput.value,
            backSideLanguage: backSideLanguageInput.value,
            backSidePicture: backSidePictureInput.value,
          },
        },
      }
    ); // TODO change this to the cards to props to edit

    onEditCardDone(
      (
        result: FetchResult<
          EditCardResponse,
          Record<string, unknown>,
          Record<string, unknown>
        >
      ) => {
        if (result.data?.editCardById.errors) {
          showErrMsg.value = true;
          errMsg.value = result.data?.editCardById.errors[0].message;
        } else {
          editResponse.value = result.data;
          store.commit(
            "cards/SET_CARDS" as RootCommitType,
            result.data?.editCardById.cards as ICard[],
            { root: true }
          );
        }
      }
    );
    return {
      submitAddCard,
      frontSideTextInput,
      frontSideLanguageInput,
      frontSidePictureInput,
      backSideTextInput,
      backSideLanguageInput,
      backSidePictureInput,
      submitEditCard,
      errMsg,
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
    addLocalCard(event: Event, card: ICard): void {
      console.log("add local card event and args", event, card);

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
    closeModal(event?: Event): void {
      console.log("close modal event", event);
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
    editLocalCard(_event: Event, card: EditCardCommitPayload): void {
      console.log("editing a local card if not logged in", _event);
      store.commit("cards/EDIT_CARD" as RootCommitType, card, {
        root: true,
      });
    },
    closeModalViaEsc(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        console.log("close modal event with escape key", event);
        store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
          root: true,
        });
      } else return;
    },
  },
  created: function (): void {
    document.addEventListener("keyup", this.closeModalViaEsc);
  },
  unmounted: function (): void {
    document.removeEventListener("keyup", this.closeModalViaEsc);
  },
});
</script>

<style lang="scss"></style>
