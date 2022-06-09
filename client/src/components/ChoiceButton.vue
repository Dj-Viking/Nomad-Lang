<template>
    <span>
        ChoiceButton.vue {{ example }}!
        <button
            type="button"
            @click="(e) => {
                (async () => {
                    await get_the_jokes();
            
                })();
            }"
        >click to get jokes</button>
    </span>
</template>
<script lang="ts">
import { MyRootState, RootDispatchType } from "@/types";
import { defineComponent, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
export default defineComponent({
    name: "ChoiceButton.vue",
    setup() {
        const store = useStore<MyRootState>();
        const example = ref<string>("works");
        return { example, store };
    },
    methods: {
        async get_the_jokes() {
            //
            console.log("jokes");
            await this.store.dispatch("cards/getFakeChoices" as RootDispatchType, null, { root: true });
        }
    },
});
</script>
<style lang="scss">
</style>