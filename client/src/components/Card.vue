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
                    deleteCard($event, id);
                    //only delete user's cards if they are logged in
                    if (isLoggedIn) {
                      submitDeleteCard($event, id);
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
                    :id="id"
                    type="submit"
                    class="button is-warning"
                    @click.prevent="
                      ($event) => {
                        (async () => {
                          shiftCardNext($event);
                        })();
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
import { defineComponent } from "@vue/runtime-core";
import store from "../store";
import Spinner from "../components/Spinner.vue";
import {
  ICard,
  LoadingState,
  ModalState,
  RootCommitType,
  RootDispatchType,
  UserState,
} from "@/types";
import { useToast } from "vue-toastification";
import { api } from "@/utils/ApiService";
import auth from "@/utils/AuthService";
export default defineComponent({
  name: "Card",
  props: ["cards", "card", "id"],
  components: {
    Spinner,
  },
  setup() {
    const toast = useToast();

    return {
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
    async deleteCard(_event: Event, id: string): Promise<void> {
      await store.dispatch("cards/deleteCard" as RootDispatchType, id, {
        root: true,
      });
    },
    async submitDeleteCard(event: any, id: string): Promise<void> {
      console.log("getting event and id to delete card", id, event);
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
    submitCardFlipCheck(event: any): void {
      const id = event.target.id;
      //set the class on for the flip animation on the card object itself.
      store.commit(
        "cards/TOGGLE_CARD_SIDE" as RootCommitType,
        //send as number because target.id is a string and all cards db assigned id's are numbers
        id,
        {
          root: true,
        }
      );
    },
    async shiftCardNext(event: any): Promise<void> {
      //update display cards array state
      // to shift a card out of the stack after done using it
      await store.dispatch(
        "cards/shiftCardNext" as RootDispatchType,
        event.target.id,
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
