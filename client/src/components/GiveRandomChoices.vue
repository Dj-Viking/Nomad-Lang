
<template>
    <span>
        <button
            class="button is-info"
            style="margin-left: 1em;"
            @click.prevent="(e) => {
                (async () => {
                    updateChoices();
                })();
            }"
        >
            GiveRandomChoices (beta)
        </button>
    </span>
</template>
<script lang="ts">
import { api } from "@/utils/ApiService";
import { defineComponent, ref } from "@vue/runtime-core";
export default defineComponent({
    name: "GiveRandomChoices",
    setup() {
        const example = ref<string>("works");
        return { example };
    },
    methods: {
        //update user's cards with the categories fetched from chuck norris serverside
        async updateChoices(): Promise<void> {
            const { choices, err } = await api.updateChoices();
            if (err) throw err;
            console.log("should get cards from update chocies", choices);
        }
    },
});
</script>
<style lang="scss">
</style>
    