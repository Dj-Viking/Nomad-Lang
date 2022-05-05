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
  RootCommitType,
} from "@/types";
import { defineComponent, ref, computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import ClearCardModal from "./ModalTypes/ClearCardModal.vue";
import { keyGen } from "@/utils/keyGen";
import { useToast } from "vue-toastification";
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
    const store = useStore();
    const errMsg = ref("");
    const showErrMsg = ref(false);
    const title = computed(() => store.state.modal.modal.title);
    const activeClass = computed(() => store.state.modal.modal.activeClass);
    const isLoggedIn = computed(() => store.state.user.user.loggedIn);
    const modalContext = computed(() => store.state.modal.modal.context);
    return {
      title,
      activeClass,
      isLoggedIn,
      modalContext,
      keyGen,
      errMsg,
      toast,
      store,
      showErrMsg,
    };
  },
  methods: {
    // eslint-disable-next-line
    closeModal(_event?: Event): void {
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
        root: true,
      });
    },
    closeModalViaEsc(): void {
      this.store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, false, {
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
