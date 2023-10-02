<template>
  <p class="control" :class="{ 'full-width': fullWidth }">
    <NeoButton
      class="explore-tabs-button"
      :tag="tag"
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
    tag: 'nuxt-link',
  }
)
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.control:not(:last-of-type) .explore-tabs-button {
  border-right: none;
}

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
