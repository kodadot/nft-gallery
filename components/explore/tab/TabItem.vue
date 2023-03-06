<template>
  <p class="control">
    <NeoButton
      class="explore-tabs-button"
      tag="nuxt-link"
      :active="active"
      :to="to"
      :icon="active ? 'check' : ''">
      <span> {{ text }}</span>
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
