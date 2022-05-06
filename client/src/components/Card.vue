<template>
  <Transition
    type="transition"
    name="fade"
    mode="out-in"
  >
    <div v-if="!isLoading">
      <Transition
        type="transition"
        name="slide-fade"
        mode="out-in"
      >
        <div v-if="card!.isFrontSide">
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
                    openDeleteCardModal($event, id!);
                  }
                "
              ></i>
              <button
                class="button is-primary ml-6"
                style="color: black; margin-top: 0.3em; margin-right: 0.4em"
                @click.prevent="
                  ($event) => {
                    openEditModal($event, card!);
                  }
                "
              >
                Edit
                <i
                  style="margin-left: 0.5em"
                  class="fa fa-pencil-square-o"
                >
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
                      v-model="translation"
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
                    :id="id!"
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
import { defineComponent, ref, computed, PropType } from "@vue/runtime-core";
import Spinner from "../components/Spinner.vue";
import {
  CardClass,
  ICard,
  MyRootState,
  RootCommitType,
  RootDispatchType,
} from "@/types";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
export default defineComponent({
  name: "Card",
  components: {
    Spinner,
  },
  props: {
    card: Object as PropType<CardClass>,
    cards: Array as PropType<Array<CardClass>>,
    id: String
  },
  setup() {
    const toast = useToast();
    const store = useStore<MyRootState>();
    const translation = ref("");
    const isLoading = computed(() => store.state.loading.loading.isLoading);
    const isLoggedIn = computed(() => store.state.user.user.loggedIn);
    const activeClass = computed(() => store.state.modal.modal.activeClass);
    return {
      toast,
      store,
      translation,
      isLoading,
      isLoggedIn,
      activeClass,
    };
  },
  methods: {
    openDeleteCardModal(_event: Event, id: string): void {
      this.store.commit("modal/SET_MODAL_TITLE" as RootCommitType, "Delete", {
        root: true,
      });
      this.store.commit("modal/SET_MODAL_CONTEXT" as RootCommitType, { _id: id }, {
        root: true,
      });
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
    submitCardFlipCheck(event: any): void {
      const id = event.target.id;
      console.log("translation", this.translation);
      if (this.card!.backSideText === this.translation) {
        console.log("YAYYYYY got it right!");
        // TODO: display message on card that it was right
        // use case insensitivity regex perhaps
        // increment the user's score when right
        // after some time flip the card back to the front and go to the next card in the CardList being displayed
      } else {
        console.error("got it wrong");
        // TODO display message on card that it was wrong
        // decrement the user's score and then show the answer
        // on the backside, after some time flip back to front and then
        // go to the next card in the CardList
      }
      this.translation = "";
      //set the class on for the flip animation on the card object itself.
      this.store.commit(
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
      await this.store.dispatch(
        "cards/shiftCardNext" as RootDispatchType,
        event.target.id,
        {
          root: true,
        }
      );
    },
    // eslint-disable-next-line
    openEditModal(_event: Event, card: ICard) {
      this.store.commit("modal/SET_MODAL_TITLE", "Edit a card", {
        root: true,
      });
      this.store.commit("modal/SET_MODAL_CONTEXT" as RootCommitType, card, {
        root: true,
      });
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
  },
  mounted() {
    if (this.card) {
      setTimeout(() => {
        this.store.commit("loading/SET_LOADING" as RootCommitType, false, {
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

/* .slide-fade-leave-active below version 2.1.8 */
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
