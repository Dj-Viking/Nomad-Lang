<template>
  <div v-if="half">
    <div class="card">
      <div class="card-image">
        <figure class="image is-4by3">
          <img
            src="https://bulma.io/images/placeholders/1280x960.png"
            alt="Placeholder image"
          />
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">something will go here</p>
            <input
              style="margin: 0 auto; width: 80%"
              class="input"
              type="text"
              placeholder="Type target translation"
            />
          </div>
        </div>

        <div class="content">something will go here</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Skeleton",
  props: {
    half: Boolean,
  },
});
</script>
