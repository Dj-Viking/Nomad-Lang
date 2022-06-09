<template>
    <button
        style="margin-bottom: 1.5rem"
        type="button"
        :value="`some value here`"
        class="button is-info"
    >
        {{ text || "nothing yet" }}
    </button>
</template>
<script lang="ts">
import { MyRootState } from "@/types";
import { defineComponent, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
export default defineComponent({
    name: "ChoiceButton.vue",
    props: {
        text: String
    },
    setup() {
        const store = useStore<MyRootState>();
        const example = ref<string>("works");
        return { example, store };
    },
    methods: {

    },
});
</script>
<style lang="scss">
</style>