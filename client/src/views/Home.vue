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
// import Modal from "@/components/Modal.vue";
import store from "../store";
import { RootCommitType } from "../types";
// import Modal from "../components/Modal.vue";
export default defineComponent({
  name: "Home",
  components: {
    CardList,
    // Modal,
  },
  methods: {
    openModal(event: Event) {
      console.log("open modal event", event);
      // const modalEl = document.querySelector("div[name=modal]");
      // console.log("found the modal element with vanilla js", modalEl);
      // modalEl?.classList.add("is-active");
      store.commit("modal/SET_MODAL_TITLE", "setting title from home page", {
        root: true,
      });
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
  },
  mounted() {
    document.title = "Home";
  },
});
</script>
