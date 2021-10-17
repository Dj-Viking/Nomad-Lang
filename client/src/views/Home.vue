<template>
  <base-layout :isHome="true">
    <div>
      <CardList />
    </div>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CardList from "../components/CardList.vue"; // @ is an alias to /src but stopped working for some reason UGH
export default defineComponent({
  name: "Home",
  components: {
    CardList,
    // Modal,
  },
  mounted() {
    document.title = "Home";
  },
});
</script>
