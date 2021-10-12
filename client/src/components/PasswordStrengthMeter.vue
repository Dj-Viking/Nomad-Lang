<template>
  <div
    v-if="input && input.length > 0"
    style="
      margin-top: 1em;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    "
  >
    <progress
      style="width: 10%"
      :value="length"
      max="20"
      :class="{
        'is-danger': assessText.color === 'red',
        'is-warning': assessText.color === 'orange',
        'is-success': assessText.color === 'green',
      }"
      class="progress"
    ></progress>
    <div style="display: flex; flex-direction: row; justify-content: center">
      <span>Password Strength:&nbsp;</span>
      <label :style="{ color: `${assessText.color}` }" class="label"
        >{{ assessText.text }}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  name: "PasswordStrengthMeter",
  props: { input: String },
  setup() {
    const length = ref(0);
    const assessText = ref<{
      text: string;
      color: string;
    }>({
      text: "",
      color: "",
    });
    return {
      length,
      assessText,
    };
  },
  watch: {
    input(newVal: string): void {
      this.length = newVal.length;
      const value = newVal;
      switch (true) {
        case value.length === 0:
          {
            this.assessText = {
              text: "",
              color: "",
            };
          }
          break;
        case (value.length > 5 && value.length <= 8) || value.length <= 5:
          {
            this.assessText = {
              text: "Weak",
              color: "red",
            };
          }
          break;
        case value.length >= 8 && value.length < 16:
          {
            this.assessText = {
              text: "Moderate",
              color: "orange",
            };
          }
          break;
        case value.length >= 16 && /.{16,100}|\w{16,100}/.test(value):
          {
            this.assessText = {
              text: "Strong",
              color: "green",
            };
          }
          break;
        default:
          this.assessText = {
            text: "",
            color: "",
          };
      }
    },
  },
});
</script>
