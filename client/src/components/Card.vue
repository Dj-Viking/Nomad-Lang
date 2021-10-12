<template>
  <Transition type="transition" name="fade">
    <div v-if="!isLoading">
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
                Frontside text: {{ card?.frontSideText }}
              </p>
              <input
                style="margin: 0 auto; width: 80%"
                class="input"
                type="text"
                placeholder="Type target translation"
              />
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
  ICard,
  LoadingState,
  RootCommitType,
  RootDispatchType,
  UserState,
} from "@/types";
import { useToast } from "vue-toastification";
export default defineComponent({
  name: "Card",
  props: ["card"],
  components: {
    Spinner,
  },
  setup(props) {
    console.log("what are props", props);

    // const { card } = toRef(props, "card");
    // console.log("what is card here", card);
    const toast = useToast();
    const inputId = ref(0);
    const { mutate: submitDeleteCard } = useMutation(
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
    activeClass: () => store.state.modal.modal.activeClass,
  },
  methods: {
    async deleteCard(_event: Event, index: number): Promise<void> {
      await store.dispatch("cards/deleteCard" as RootDispatchType, index, {
        root: true,
      });
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
</style>
