<template>
  <p class="control">
    <NeoButton
      class="explore-tabs-button"
      tag="nuxt-link"
      :active="active"
      :to="to">
      <span> {{ text }}</span>
      <img v-if="active" src="/checkmark.svg" />
    </NeoButton>
  </p>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

defineProps<{
  active: boolean
  text: string
  to: string
}>()
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.control,
.explore-tabs-button {
  width: 15rem;

  @include until-widescreen {
    width: 12rem;
  }

  @include mobile {
    width: 100%;
  }
}
</style>

<style>
.dark-mode .explore-tabs-button.active img {
  filter: brightness(0%);
}
</style>
