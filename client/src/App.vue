<template>
  <Notification />
  <Transition name="fade" type="transition">
    <div v-if="activeClass">
      <div>
        <Modal />
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "./components/Modal.vue";
import Notification from "./components/Notification.vue";
import store from "./store";
import { ModalState, OpenNotificationPayload, RootCommitType } from "./types";
// import Spinner from "./components/Spinner.vue";
export default defineComponent({
  name: "App",
  components: {
    Modal,
    Notification,
    // Spinner,
    // Modalv2,
  },
  computed: {
    activeClass: (): ModalState["modal"]["activeClass"] =>
      store.state.modal.modal.activeClass,
  },
  methods: {
    openModal(event: Event) {
      console.log("open modal event", event);
      store.commit("modal/SET_MODAL_TITLE", "setting title from home page", {
        root: true,
      });
      store.commit("modal/SET_MODAL_ACTIVE" as RootCommitType, true, {
        root: true,
      });
    },
    openError(event: MouseEvent): void {
      console.log("open notification click event", event.target);

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
    openSuccess(event: MouseEvent): void {
      console.log("open notification click event", event.target);

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
      console.log("clicked close button on notification after some time ");
      store.commit(
        "notification/CLOSE_NOTIFICATION" as RootCommitType,
        {},
        { root: true }
      );
    },
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
</style>
