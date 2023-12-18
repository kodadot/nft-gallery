<template>
  <div
    v-if="isUnlockableLandingTagVisible"
    class="unlockable-landing-tag is-flex border is-justify-content-space-between is-align-items-center px-4 mt-6"
    :class="{ 'small-size': smallWidth }">
    <div class="is-flex is-align-items-center">
      <img
        width="42"
        height="42"
        src="/drop/unlockable-pulse-static.svg"
        alt="unlockable icon" />
      <span> {{ mintStatusText }} </span>
    </div>
    <div class="separator mx-2" />
    <nuxt-link
      class="is-flex is-align-items-center has-text-weight-bold my-2"
      :to="to">
      {{ actionText }}
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { useUnlockableTag } from './utils/useUnlockableTag'
const isUnlockableLandingTagVisible = true

const { to, actionText, mintStatusText, smallWidth } = useUnlockableTag()
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
