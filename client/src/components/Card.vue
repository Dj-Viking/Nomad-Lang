<template>
  <Transition type="transition" name="fade" mode="out-in">
    <div v-if="!isLoading">
      <Transition type="transition" name="slide-fade" mode="out-in">
        <div v-if="card.isFrontSide">
          <div class="card">
            <div style="display: flex; justify-content: space-between">
              <i
                style="
                  color: #f14668;
                  font-size: 30px;
                  margin-top: 0.2em;
                  margin-left: 0.4em;
                  margin-bottom: 0.4em;
                  cursor: pointer;
                "
                class="fa fa-trash"
                @click.prevent="
                  ($event) => {
                    //update vuex cards that are displayed
                    deleteCard($event, card?.id);
                    //only delete user's cards if they are logged in
                    if (isLoggedIn) {
                      submitDeleteCard({
                        id: card?.id,
                      });
                    }
                  }
                "
              ></i>
              <button
                class="button is-primary ml-6"
                style="color: black; margin-top: 0.3em; margin-right: 0.4em"
                @click.prevent="
                  ($event) => {
                    openEditModal($event, card);
                  }
                "
              >
                Edit
                <i style="margin-left: 0.5em" class="fa fa-pencil-square-o">
                </i>
              </button>
            </div>
            <div class="card-image">
              {{ card?.frontSidePicture }}
              <figure class="image is-4by3">
                <img
                  src="https://bulma.io/images/placeholders/1280x960.png"
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <div v-if="/<strong>/g.test(card?.frontSideText)">
                    <p v-html="card?.frontSideText"></p>
                  </div>
                  <div v-else>
                    <p class="title is-4">{{ card?.frontSideText }}</p>
                  </div>
                  <form
                    :id="id"
                    @submit.prevent="
                      ($event) => {
                        submitCardFlipCheck($event);
                      }
                    "
                  >
                    <input
                      style="margin: 0 auto; width: 80%"
                      class="input"
                      type="text"
                      placeholder="Translate!"
                    />
                    <button
                      class="button is-primary"
                      style="color: black"
                      type="submit"
                    >
                      Check
                    </button>
                  </form>
                  <button
                    :id="card && card?.id"
                    class="button is-warning"
                    @click.prevent="
                      ($event) => {
                        shiftCardNext($event);
                      }
                    "
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="card">
            <div style="height: 48px">&nbsp;</div>
            <div class="card-image">
              {{ card?.backSidePicture }}
              <figure class="image is-4by3">
                <img
                  src="https://bulma.io/images/placeholders/1280x960.png"
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-5">
                    {{ card?.backSideText }}
                  </p>
                  <form
                    :id="id"
                    @submit.prevent="
                      ($event) => {
                        submitCardFlipCheck($event);
                      }
                    "
                  >
                    <input
                      style="margin: 0 auto; width: 80%"
                      class="input"
                      type="text"
                      placeholder="Translate!"
                    />
                    <button
                      class="button is-primary"
                      style="color: black"
                      type="submit"
                    >
                      Flip
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <div v-else>
      <div style="height: 0; margin: 0; padding: 0">
        <Spinner />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { createDeleteCardMutation } from "@/graphql/mutations/myMutations";
import store from "../store";
import Spinner from "../components/Spinner.vue";
import {
  DeleteCardResponse,
  ICard,
  LoadingState,
  ModalState,
  RootCommitType,
  RootDispatchType,
  UserState,
} from "@/types";
import { useToast } from "vue-toastification";
import { FetchResult } from "@apollo/client/core";
export default defineComponent({
  name: "Card",
  props: ["cards", "card", "id"],
  components: {
    Spinner,
  },
  setup() {
    // console.log("what are props", props);

    // const { card } = toRef(props, "card");
    // console.log("what is card here", card);
    const toast = useToast();
    const inputId = ref(0);
    const { mutate: submitDeleteCard, onDone: onDeleteDone } = useMutation(
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

    onDeleteDone(
      (
        result: FetchResult<
          DeleteCardResponse,
          Record<string, unknown>,
          Record<string, unknown>
        >
      ): void => {
        if (result.data?.deleteCard.errors?.length) {
          toast.error("There was a problem deleting a card", {
            timeout: 3000,
          });
        } else {
          //set the cards again
          //, which will also reset the categorized object
          // use the async dispatch set cards
        }
      }
    );

    return {
      submitDeleteCard,
      toast,
    };
  },
  computed: {
    isLoading: (): LoadingState["loading"]["isLoading"] =>
      store.state.loading.loading.isLoading,
    isLoggedIn: (): UserState["user"]["loggedIn"] =>
      store.state.user.user.loggedIn,
    activeClass: (): ModalState["modal"]["activeClass"] =>
      store.state.modal.modal.activeClass,
  },
  methods: {
    async deleteCard(_event: Event, id: number): Promise<void> {
      await store.dispatch("cards/deleteCard" as RootDispatchType, id, {
        root: true,
      });
    },
    submitCardFlipCheck(event: any): void {
      // const id = event.target.id;
      //set the class on for the flip animation on the card object itself.
      store.commit(
        "cards/TOGGLE_CARD_SIDE" as RootCommitType,
        //send as number because target.id is a string and all cards db assigned id's are numbers
        { id: Number(event.target.id) },
        {
          root: true,
        }
      );
    },
    shiftCardNext(event: any): void {
      //update display cards array state
      // to shift a card out of the stack after done using it
      store.dispatch(
        "cards/shiftCardNext" as RootDispatchType,
        Number(event.target.id),
        {
          root: true,
        }
      );
    },
    // eslint-disable-next-line
    openEditModal(_event: Event, card: ICard) {
      store.commit("modal/SET_MODAL_TITLE", "Edit a card", {
        root: true,
      });
      store.commit("modal/SET_MODAL_CONTEXT" as RootCommitType, card, {
        root: true,
      });
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
  },
  mounted() {
    if (this.card) {
      setTimeout(() => {
        store.commit("loading/SET_LOADING" as RootCommitType, false, {
          root: true,
        });
      }, 500);
    }
  },
});
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity height 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  height: 0;
}

/*
make some kind of class for the card 'flipping'
*/

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(100px);
  opacity: 0;
}
</style>
