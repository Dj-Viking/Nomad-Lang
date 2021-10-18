<template>
  <div class="side-bar">
    <h3 class="title">Side Bar</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "SideBar",
});
</script>

<style lang="scss">
.side-bar {
  background-color: rgb(213, 213, 213);
  position: fixed;
  top: 0;
  height: 100vh;
  width: 20vh;
  z-index: 10000;
}
</style>
