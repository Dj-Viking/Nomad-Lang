<template>
  <div class="container some-unique-class">
    <h2
      v-if="cards.length > 0"
      :class="{ 'title-light': isLight, 'title-dark': isDark }"
      class="title mb-0"
    >
      <div style="display: flex; flex-direction: column;">
        <span>Your Cards</span>
        <div style="display: flex; justify-content: center;">
          <div style="display: flex; flex-direction: column; font-size: 20px; margin-bottom: .5em; margin-top: .5em;">
            Your score:
            <span
              id="correct-score"
              style="margin-right: 10px;"
              class="has-text-primary no-margin-left-mobile"
            >
              Correct: {{ correct }}
            </span>
            <span
              id="incorrect-score"
              class="has-text-danger"
            >
              Incorrect: {{ incorrect }}
            </span>
          </div>
        </div>
      </div>
    </h2>
    <h2
      v-else
      :class="{ title: isLight, 'title-dark': isDark }"
      class="mb-0"
    >
      No Cards Yet
    </h2>
    <div style="display: flex; flex-direction: row; justify-content: center; margin: 0 auto 1em auto;">
      <button
        style="margin-right: 0.5em"
        class="button is-info button-shrink"
        @click.prevent="
          ($event) => {
            //clear local cards
            clearCardsModal($event);
          }
        "
      >
        Clear Cards
      </button>
      <div class="control">
        <button
          id="add-button"
          @click.prevent="openAddModal($event)"
          class="button is-info button-shrink"
          type="button"
          style="
            color: white;
            margin-left: 0.5em;
            margin-right: 0.5em;
          "
        >
          Add New Card
        </button>
      </div>
      <div class="control">
        <button
          class="button is-info button-shrink"
          style="color: white; margin-left: 0.5em"
          @click.prevent="resetDisplayCards($event)"
        >
          <span v-if="!aCategoryIsActive">Reset Cards</span>
          <span v-else>Reset Category</span>
        </button>
      </div>
      <div class="control">
        <GiveRandomChoices />
      </div>
    </div>
    <Transition
      type="transition"
      name="fade"
      mode="out-in"
    >
      <div
        style="
          align-items: center;
          display: flex;
          justify-content: center;
          flex-direction: column;
        "
        v-if="cards.length > 0"
      >
        <div
          style="
            margin-bottom: 0;
            width: 80%;
            position: relative;
            align-items: center;
            display: flex;
            justify-content: center;
          "
          :class="{
            'notification is-light': isLight,
            'notification is-dark': isDark,
          }"
          v-for="(card, i) of cards"
          :key="i"
        >
          <Card
            :id="card._id"
            :cards="cards"
            :card="card"
          />
        </div>
      </div>
      <div
        style="margin: 10%;"
        v-else
      >
        <div v-if="allCards.length > 0">
          <span style="color: white;">
            <h3
              :class="{ 'text-light': isLight, 'text-dark': isDark }"
              class="title is-3"
            >
              Final Score
            </h3>
            <p
              id="correct-final-score"
              :class="{ 'text-light': isLight, 'text-dark': isDark }"
            >
              Correct: {{ correct }}
            </p>
            <p
              id="incorrect-final-score"
              :class="{ 'text-light': isLight, 'text-dark': isDark }"
            >
              Incorrect: {{ incorrect }}
            </p>
          </span>
          <div style="margin-top: 10px;">
            <button
              class="button is-info"
              @click.prevent="resetDisplayCards($event)"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import {
  RootCommitType,
  MyGetters,
  MyRootState,
  CardClass,
} from "../types";
import { ref, defineComponent, computed } from "vue";
import Card from "../components/Card.vue";
import GiveRandomChoices from "../components/GiveRandomChoices.vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "CardList",
  components: {
    Card,
    GiveRandomChoices
  },
  setup() {
    const inputId = ref(0);
    const input = ref("");
    const store = useStore<MyRootState>();

    const correct = computed<number>(() =>
      store.getters["user/correct" as MyGetters]);
    const incorrect = computed<number>(() =>
      store.getters["user/incorrect" as MyGetters]);
    const aCategoryIsActive = computed<boolean>(() =>
      store.getters["sidebarCategories/aCategoryIsActive" as MyGetters]);
    const currentActiveCategoryCards = computed<Array<CardClass>>(() =>
      store.getters["sidebarCategories/currentActiveCategoryCards" as MyGetters]);

    const isLight = computed(() => store.state.theme.theme === "light");
    const isDark = computed(() => store.state.theme.theme === "dark");
    const allCards = computed(() => store.state.cards.allCards);
    const cards = computed(() => store.state.cards.cards);
    const isLoggedIn = computed(() => store.state.user.user.loggedIn);
    const isLoading = computed(() => store.state.loading.loading.isLoading);
    return {
      inputId,
      input,
      store,
      correct,
      incorrect,
      aCategoryIsActive,
      currentActiveCategoryCards,
      isLight,
      isDark,
      allCards,
      cards,
      isLoggedIn,
      isLoading,
    };
  },
  methods: {
    resetDisplayCards(_event: any): void {
      _event.preventDefault();
      this.store.commit("user/RESET_ANSWERS" as RootCommitType, null, { root: true });
      if (this.cards.length !== this.allCards.length) {
        if (this.aCategoryIsActive) {
          this.store.commit(
            "cards/SET_DISPLAY_CARDS" as RootCommitType,
            { cards: this.currentActiveCategoryCards },
            { root: true }
          );
        } else {
          this.store.commit(
            "cards/SET_DISPLAY_CARDS" as RootCommitType,
            { cards: this.allCards },
            { root: true }
          );
        }
      }
    },
    // eslint-disable-next-line
    clearCardsModal(_event: Event): void {
      this.store.commit("modal/SET_MODAL_TITLE" as RootCommitType, "Clear Cards", {
        root: true,
      });
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
    openAddModal(_event: MouseEvent): void {
      _event.preventDefault();
      //set modal title
      this.store.commit("modal/SET_MODAL_TITLE", "Add a new Card", {
        root: true,
      });
      // open the modal
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
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

@media only screen and (min-width: 1280px) {
  .no-margin-left-mobile {
    margin-left: 10px;
  }
}

@media only screen and (max-width: 1280px) {

  .no-margin-left-mobile {
    margin-left: 10px;
  }

}

@media only screen and (max-width: 430px) {
  .button-shrink {
    font-size: 3vw;
    width: 25vw;
    height: 5vh;
  }

}

@media only screen and (max-width: 557px) {}
</style>
