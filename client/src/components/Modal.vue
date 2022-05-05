<template>
  <div
    :class="{ 'is-active': activeClass }"
    class="modal"
    name="modal"
  >
    <div class="modal-background"></div>
    <div
      class="modal-content"
      style="width: 75%"
    >
      <div v-if="/Clear/g.test(title)">
        <ClearCardModal :title="title" />
      </div>
      <div v-if="/Edit/g.test(title)">
        <EditCardModal
          :title="title"
          :card="modalContext.card"
        />
      </div>
      <div
        id="add-form-container"
        v-if="/Add/g.test(title)"
      >
        <AddCardModal :title="title" />
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
} from "@/types";
import { defineComponent, ref } from "@vue/runtime-core";
import ClearCardModal from "./ModalTypes/ClearCardModal.vue";
import { keyGen } from "@/utils/keyGen";
import { useToast } from "vue-toastification";
import store from "../store";
import EditCardModal from "./ModalTypes/EditCardModal.vue";
import AddCardModal from "./ModalTypes/AddCardModal.vue";
export default defineComponent({
  name: "Modal",
  components: {
    ClearCardModal,
    EditCardModal,
    AddCardModal
  },
  setup() {
    const toast = useToast();

    const errMsg = ref("");
    const showErrMsg = ref(false);

    return {
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
    closeModal(_event?: Event): void {
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
    closeModalViaEsc(): void {
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
  },
  mounted: function (): void {
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

<style lang="scss">
</style>
