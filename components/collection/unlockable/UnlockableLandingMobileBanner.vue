<template>
  <div
    class="container is-fluid is-flex border-top is-justify-content-space-between is-align-items-center py-3 mt-7">
    <div class="is-flex is-align-items-center">
      <img
        width="42"
        height="42"
        src="/drop/unlockable-pulse-static.svg"
        alt="unlockable icon" />
      <span>{{ mintStatusText }}</span>
    </div>
    <nuxt-link class="has-text-weight-bold" :to="to">
      {{ actionText }}
    </nuxt-link>
  </div>
</template>
<script setup>
import { useUnlockableTag } from './utils/useUnlockableTag'

const { to, actionText, mintStatusText } = useUnlockableTag(true)
</script>
