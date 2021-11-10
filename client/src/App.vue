<template>
  <Transition name="fade" type="transition">
    <div v-if="activeClass">
      <div>
        <Modal />
      </div>
    </div>
    <div v-else>
      <SideBar />
      <router-view />
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "./components/Modal.vue";
import SideBar from "./components/SideBar.vue";
import store from "./store";
import {
  ModalState,
  OpenNotificationPayload,
  RootCommitType,
  SidebarState,
} from "./types";
export default defineComponent({
  name: "App",
  components: {
    Modal,
    SideBar,
  },
  computed: {
    sidebarOpen: (): SidebarState["sidebar"]["isOpen"] =>
      store.state.sidebar.sidebar.isOpen,
    activeClass: (): ModalState["modal"]["activeClass"] =>
      store.state.modal.modal.activeClass,
  },
  methods: {
    openModal() {
      store.commit("modal/SET_MODAL_TITLE", "setting title from home page", {
        root: true,
      });
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
    openError(): void {
      store.commit(
        "notification/OPEN_NOTIFICATION" as RootCommitType,
        {
          notification: {
            type: "error",
            message: "heres an error message",
            toastDown: true,
            toastUp: false,
          },
        } as OpenNotificationPayload,
        { root: true }
      );
      setTimeout(() => {
        this.closeNotification();
      }, 3000);
    },
    openSuccess(): void {
      store.commit(
        "notification/OPEN_NOTIFICATION" as RootCommitType,
        {
          notification: {
            type: "success",
            message: "heres an success message",
            toastDown: true,
            toastUp: false,
          },
        } as OpenNotificationPayload,
        { root: true }
      );
      setTimeout(() => {
        this.closeNotification();
      }, 3000);
    },
    closeNotification(): void {
      store.commit(
        "notification/CLOSE_NOTIFICATION" as RootCommitType,
        {},
        { root: true }
      );
    },
  },
  mounted() {
    const theme = window.localStorage.getItem("theme");
    if (!theme) {
      document.body.classList.add("body-light");
    } else {
      switch (true) {
        case theme === "light":
          {
            document.body.classList.remove("body-dark");
            document.body.classList.add("body-light");
            // eslint-disable-next-line
            document.querySelector("html")!.style.backgroundColor = "white";
          }
          break;
        case theme === "dark":
          {
            document.body.classList.remove("body-light");
            document.body.classList.add("body-dark");
            // eslint-disable-next-line
            document.querySelector("html")!.style.backgroundColor = "#222222";
          }
          break;
      }
    }
  },
});
</script>

<style lang="scss">
#app {
  font-family: "Grechen Fuemen", cursive;
  font-family: "Imbue", serif;
  font-family: "Kosugi Maru", sans-serif;
  font-family: "Roboto", sans-serif;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.show-me {
  display: block;
}
.hide-me {
  display: none;
}
</style>
