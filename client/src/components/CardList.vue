<template>
  <div class="container some-unique-class">
    <h2
      v-if="cards.length > 0"
      :class="{ 'title-light': isLight, 'title-dark': isDark }"
      class="title mb-0"
    >
      Your Cards
    </h2>
    <h2 v-else :class="{ title: isLight, 'title-dark': isDark }" class="mb-0">
      No Cards Yet
    </h2>
    <div style="display: flex; flex-direction: row; justify-content: center">
      <button
        style="margin-right: 0.5em"
        class="button is-info"
        @click.prevent="
          ($event) => {
            //clear local cards
            clearCardsModal($event);
          }
        "
      >
        clear cards
      </button>
      <div>
        <div class="control">
          <button
            @click.prevent="openAddModal($event)"
            class="button is-info"
            type="submit"
            style="color: rgb(255, 255, 255); margin-left: 0.5em"
          >
            Add New Card
          </button>
        </div>
      </div>
    </div>
    <Transition type="transition" name="fade" mode="out-in">
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
            :id="card.id"
            :cards="cards"
            :isFrontSide="true"
            :isBackSide="false"
            :card="card"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { RootCommitType, CardsState, UserState, LoadingState } from "../types";
import { ref, defineComponent } from "vue";
import store from "../store";
import Card from "../components/Card.vue";
// import Spinner from "../components/Spinner.vue";

export default defineComponent({
  name: "CardList",
  components: {
    Card,
    // Spinner,
  },
  setup() {
    const inputId = ref(0);
    const input = ref("");

    return {
      input,
      inputId,
    };
  },
  computed: {
    isLight: () => store.state.theme.theme === "light",
    isDark: () => store.state.theme.theme === "dark",
    cards: (): CardsState["cards"] => store.state.cards.cards,
    isLoggedIn: (): UserState["user"]["loggedIn"] =>
      store.state.user.user.loggedIn,
    isLoading: (): LoadingState["loading"]["isLoading"] =>
      store.state.loading.loading.isLoading,
  },
  methods: {
    // eslint-disable-next-line
    readInputEvent(_event: Event) {
      //do nothing
    },

    // eslint-disable-next-line
    clearCardsModal(_event: Event): void {
      store.commit("modal/SET_MODAL_TITLE" as RootCommitType, "Clear Cards", {
        root: true,
      });
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
    // eslint-disable-next-line
    openAddModal(_event: MouseEvent): void {
      //set modal title
      store.commit("modal/SET_MODAL_TITLE", "Add a new Card", {
        root: true,
      });
      // open the modal
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
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
</style>
