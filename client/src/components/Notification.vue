<template>
  <div
    :class="{
      'notification-container-animate-down': toastDown,
      'notification-container-animate-up': toastUp,
    }"
    class="notification-container"
    name="notification-container"
  >
    <div v-if="type === 'error'">
      <div class="notification is-danger is-light notification-content">
        <button
          class="delete"
          @click.prevent="closeNotification($event)"
        ></button>
        Error: {{ message }}
      </div>
    </div>
    <div v-if="type === 'success'">
      <div class="notification is-success is-light notification-content">
        <button
          class="delete"
          @click.prevent="closeNotification($event)"
        ></button>
        Success: {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { NotificationState, RootCommitType } from "@/types";
import { defineComponent } from "@vue/runtime-core";
import store from "../store";

export default defineComponent({
  name: "Notification",
  computed: {
    message: (): NotificationState["notification"]["message"] =>
      store.state.notification.notification.message,
    type: (): NotificationState["notification"]["type"] =>
      store.state.notification.notification.type,
    toastUp: (): NotificationState["notification"]["toastUp"] =>
      store.state.notification.notification.toastUp,
    toastDown: (): NotificationState["notification"]["toastDown"] =>
      store.state.notification.notification.toastDown,
  },
  methods: {
    closeNotification(event: MouseEvent): void {
      console.log("clicked close button on notification", event.target);
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
@keyframes animatedown {
  from {
    top: -500px;
    opacity: 0;
  }
  to {
    top: 25px;
    opacity: 1;
  }
}

@keyframes animateup {
  from {
    top: 10px;
    opacity: 1;
  }
  to {
    top: -100px;
    opacity: 0;
  }
}

.notification-container-animate-down {
  width: 100%;
  position: absolute;
  z-index: 10000;
  display: flex;
  margin-top: 10px;
  flex-direction: row;
  justify-content: flex-end;
  animation-name: animatedown;
  animation-duration: 0.8s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
.notification-container-animate-up {
  width: 100%;
  position: absolute;
  z-index: 10000;
  display: flex;
  margin-top: 10px;
  flex-direction: row;
  justify-content: flex-end;
  animation-name: animateup;
  animation-duration: 0.8s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}

.notification-content {
  font-size: 10px;
}
</style>
