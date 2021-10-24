<template>
  <Transition type="transition" name="fade" mode="out-in">
    <div v-if="!isLoading">
      <Transition type="transition" name="slide-fade" mode="out-in">
        <div v-if="card.isFrontSide">
          <div class="card">
            <div class="card-image">
              Picture link or base64 string: {{ card?.frontSidePicture }}
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
                  <p class="title is-4">
                    {{ card?.frontSideText }}
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
                      placeholder="Type target translation"
                    />
                    <button
                      class="button is-primary"
                      style="color: black"
                      type="submit"
                    >
                      Check
                    </button>
                  </form>
                </div>
              </div>

              <div class="content">
                fs lang: {{ card?.frontSideLanguage }}
                <br />
              </div>
            </div>
          </div>
          <div style="margin-top: 1em">
            <button
              class="button is-danger mx-2"
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
            >
              Delete Card
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
          <div class="card">
            <div class="card-image">
              Picture link or base64 string: {{ card?.backSidePicture }}
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
                  <p class="title is-4">
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
                      placeholder="Type target translation"
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

              <div class="content">
                bs lang: {{ card?.backSideLanguage }}
                <br />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <div v-else>
      <Spinner />
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { createDeleteCardMutation } from "@/graphql/mutations/myMutations";
import store from "../store";
// import Skeleton from "../components/Skeleton.vue";
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
      console.log("card flip event", event.target.id);
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
    openEditModal(event: Event, card: ICard) {
      console.log(
        "able to get id in this loop to also open the modal?????",
        card
      );
      console.log("open modal from card list", event);
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
    console.log("mounted do we have props", this.card);
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
