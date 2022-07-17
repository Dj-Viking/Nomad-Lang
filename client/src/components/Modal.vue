<template>
    <div :class="{ 'is-active': activeClass }" class="modal" name="modal">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 75%">
            <div v-if="/Clear/g.test(title)">
                <ClearCardModal :title="title" />
            </div>

            <div v-if="/Edit/g.test(title)">
                <EditCardModal :title="title" :card="modalContext.card" />
            </div>

            <div id="add-form-container" v-if="/Add/g.test(title)">
                <AddCardModal :title="title" />
            </div>

            <div v-if="/Delete/g.test(title)">
                <DeleteCardModal :title="title" :id="cardId" />
            </div>
            <div v-if="/Choice/g.test(title)">
                <ChoiceTextModal :title="title" :id="cardId" />
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
import { MyRootState, RootCommitType } from "@/types";
import { defineComponent, ref, computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import ClearCardModal from "./ModalTypes/ClearCardModal.vue";
import { keyGen } from "@/utils/keyGen";
import { useToast } from "vue-toastification";
import EditCardModal from "./ModalTypes/EditCardModal.vue";
import AddCardModal from "./ModalTypes/AddCardModal.vue";
import DeleteCardModal from "./ModalTypes/DeleteCardModal.vue";
import ChoiceTextModal from "./ModalTypes/ChoiceTextModal.vue";
export default defineComponent({
    name: "Modal",
    components: {
        ClearCardModal,
        EditCardModal,
        AddCardModal,
        DeleteCardModal,
        ChoiceTextModal,
    },
    setup() {
        const toast = useToast();
        const store = useStore<MyRootState>();
        const errMsg = ref("");
        const showErrMsg = ref(false);
        const cardId = computed(() => store.state.modal.modal.context.card._id);
        const title = computed(() => store.state.modal.modal.title);
        const activeClass = computed(() => store.state.modal.modal.activeClass);
        const isLoggedIn = computed(() => store.state.user.user.loggedIn);
        const modalContext = computed(() => store.state.modal.modal.context);
        return {
            cardId,
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
            this.store.commit(
                "modal/SET_MODAL_ACTIVE" as RootCommitType,
                false,
                {
                    root: true,
                }
            );
        },
        closeModalViaEsc(): void {
            this.store.commit(
                "modal/SET_MODAL_ACTIVE" as RootCommitType,
                false,
                {
                    root: true,
                }
            );
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

<style lang="scss"></style>
