<template>
  <div
    v-if="isUnlockableLandingTagVisible"
    class="unlockable-landing-tag flex border justify-between items-center px-4 mt-6"
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
</template>

<script lang="ts" setup>
import { useUnlockableTag } from './utils/useUnlockableTag'
const isUnlockableLandingTagVisible = true

const { width } = useWindowSize()
const smallWidth = computed(() => width.value < 502)

const { to, actionText, mintStatusText } = useUnlockableTag(smallWidth.value)
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
