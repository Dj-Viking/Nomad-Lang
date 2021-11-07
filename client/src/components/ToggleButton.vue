<template>
  <div
    :class="{ 'toggle-slot-light': isLight, 'toggle-slot-dark': isDark }"
    @click.prevent="
      ($event) => {
        toggleTheme($event);
      }
    "
  >
    &nbsp;
  </div>
  <button
    id="toggle-btn"
    type="button"
    @click.prevent="
      ($event) => {
        toggleTheme($event);
      }
    "
    :class="{ 'my-toggle-light': isLight, 'my-toggle-dark': isDark }"
  >
    <i :class="{ 'fa fa-sun-o': isLight, 'fa fa-moon-o': isDark }"></i>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { RootCommitType } from "@/types";
import store from "../store";
export default defineComponent({
  name: "ToggleButton",
  computed: {
    isLight: () => store.state.theme.theme === "light",
    isDark: () => store.state.theme.theme === "dark",
  },
  methods: {
    toggleTheme(event: any): void {
      console.log("toggle event", event.target);
      store.commit("theme/TOGGLE_THEME" as RootCommitType, {}, { root: true });
    },
  },
});
</script>
<style lang="scss">
.toggle-slot-light {
  animation: toggle-slot-light;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;
  background-color: rgb(255, 172, 49);
  position: relative;
  width: 100px;
  margin-left: 0.5em;
  border-radius: 20px;
}
.toggle-slot-dark {
  animation: toggle-slot-dark;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  background-color: rgb(34, 34, 34);
  cursor: pointer;
  position: relative;
  width: 100px;
  margin-left: 0.5em;
  border-radius: 20px;
}

@keyframes toggle-slot-light {
  from {
    background-color: rgb(34, 34, 34);
  }
  to {
    background-color: rgb(255, 172, 49);
  }
}
@keyframes toggle-slot-dark {
  from {
    background-color: rgb(255, 172, 49);
  }
  to {
    background-color: rgb(34, 34, 34);
  }
}

@keyframes toggle-dark {
  from {
    right: 8px;
  }
  to {
    right: 68px;
  }
}
@keyframes toggle-light {
  from {
    right: 68px;
  }
  to {
    right: 8px;
  }
}

.my-toggle-dark {
  font-size: 20px;
  color: rgb(34, 34, 34);
  animation: toggle-dark;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  padding: 0;
  margin: 0;
  border: none;
  height: 40px;
  width: 40px;
  position: absolute;
  cursor: pointer;
  top: 8px;
  right: 68px;
  border-radius: 50%;
}
.my-toggle-light {
  font-size: 20px;
  color: rgb(255, 172, 49);
  animation: toggle-light;
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  padding: 0;
  margin: 0;
  border: none;
  height: 40px;
  width: 40px;
  position: absolute;
  cursor: pointer;
  top: 8px;
  border-radius: 50%;
}
</style>
