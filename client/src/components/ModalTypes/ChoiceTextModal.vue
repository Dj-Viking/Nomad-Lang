<template>
    <div>hello world</div>
</template>
<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
export default defineComponent({
    name: "ChoiceText",
    setup() {
        const example = ref<string>("works");
        return { example };
    },
    methods: {},
});
</script>
<style lang="scss"></style>
