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
      class="rounded-full flex border justify-between items-center px-4 bg-background-color">
      <div class="flex items-center">
        <img
          width="42"
          height="42"
          src="/drop/unlockable-pulse-static.svg"
          alt="unlockable icon" />
        <span> {{ mintStatusText }} </span>
      </div>
      <div class="w-4 h-[1px] bg-separator-line-color mx-2" />
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
