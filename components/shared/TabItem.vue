<template>
  <p class="control" :class="{ 'full-width': fullWidth }">
    <NeoButton
      class="explore-tabs-button"
      :tag="NuxtLink || tag"
      :no-shadow="noShadow"
      :active="active"
      :to="to"
      :icon="active ? 'check' : ''">
      <span> {{ text }}</span>
    </NeoButton>
  </p>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { resolveComponent } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')

withDefaults(
  defineProps<{
    active: boolean
    text: string
    to?: string
    fullWidth?: boolean
    noShadow?: boolean
    tag?: string
  }>(),
  {
    to: '',
  }
)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

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

.full-width {
  &.control,
  .explore-tabs-button {
    width: 100%;
  }
}
</style>
