<template>
    <p style="color: white">
        {{ modal.context.card.backSideText }}
    </p>
</template>
<script lang="ts">
import { MyRootState } from "@/types";
import { computed } from "@vue/reactivity";
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "vuex";
export default defineComponent({
    name: "ChoiceText",
    setup() {
        const store = useStore<MyRootState>();
        const modal = computed(() => store.state.modal.modal);

        return { modal, store };
    },
    methods: {},
});
</script>
<style lang="scss"></style>
