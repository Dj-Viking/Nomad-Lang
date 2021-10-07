<template>
  <div class="relative">
    <slot name="activator" @click="onClick"
      ><div @click="toggleMenu">he</div>
    </slot>
    <div v-if="menuOpen" class="absolute top-0 left-0" @click="onContentClick">
      <slot>default menu</slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const menuOpen = ref(false);
    const toggleMenu = () => {
      console.log("menu toggle");
      menuOpen.value = !menuOpen.value;
    };
    const onClickAway = () => {
      if (menuOpen.value === true) menuOpen.value = false;
    };
    const onContentClick = () => {
      console.log("clicked content");
      menuOpen.value = false;
    };
    const onClick = () => {
      console.log("on triggered");
      toggleMenu();
    };
    return { toggleMenu, menuOpen, onClickAway, onContentClick, onClick };
  },
});
</script>
<style lang="scss" scoped></style>
