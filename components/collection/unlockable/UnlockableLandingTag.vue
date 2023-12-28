<template>
  <div class="mt-6">
    <NeoSkeleton
      v-if="!isReady"
      border-radius="5rem"
      height="44"
      no-margin
      width="430" />
    <div
      v-else
      class="unlockable-landing-tag flex border justify-between items-center px-4"
      :class="{ 'small-size': smallWidth }">
      <div class="flex items-center">
        <img
          width="42"
          height="42"
          src="/drop/unlockable-pulse-static.svg"
          alt="unlockable icon" />
        <span> {{ mintStatusText }} </span>
      </div>
      <div class="separator mx-2" />
      <nuxt-link class="flex items-center has-text-weight-bold my-2" :to="to">
        {{ actionText }}
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
import { useUnlockableTag } from './utils/useUnlockableTag'

const { width } = useWindowSize()
const smallWidth = computed(() => width.value < 502)

const { to, actionText, mintStatusText, isReady } = useUnlockableTag(
  smallWidth.value,
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables.scss';
.unlockable-landing-tag {
  border-radius: 2rem;
  @include ktheme() {
    background-color: theme('background-color');
    .separator {
      background: theme('separator-line-color');
      width: 15px;
      height: 1px;
    }
  }

  &.small-size {
    flex-direction: column;
    border-radius: 1rem;
    .separator {
      width: 100%;
    }
  }
}
</style>
