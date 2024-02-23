<template>
  <div
    class="w-full px-5 md:px-10 flex border-t justify-between items-center py-3 mt-7">
    <div class="flex items-center">
      <img
        width="42"
        height="42"
        src="/drop/unlockable-pulse-static.svg"
        alt="unlockable icon" />
      <NeoSkeleton v-if="!isReady" height="15" no-margin width="120" />
      <span v-else>{{ mintStatusText }}</span>
    </div>
    <div class="flex items-center">
      <NeoSkeleton v-if="!isReady" height="15" no-margin width="80" />
      <nuxt-link v-else class="font-bold" :to="to">
        {{ actionText }}
      </nuxt-link>
    </div>
  </div>
</template>
<script setup>
import { useUnlockableTag } from './utils/useUnlockableTag'
import { NeoSkeleton } from '@kodadot1/brick'

const { to, actionText, mintStatusText, isReady } = useUnlockableTag(true)
</script>
