<template>
  <div class="flex flex-col justify-center items-center px-6 pt-10 pb-11">
    <h2 class="font-bold text-xl mb-4 text-center">
      Choose how you'd like to <br />set up your profile
    </h2>
    <span class="text-sm text-k-grey mb-5 text-center"
      >Quick import from Farcaster, or start fresh</span
    >
    <NeoButton
      expanded
      class="!bg-purple-light-color h-14"
      no-shadow
      @click="emit('importFarcaster')">
      <div class="flex items-center justify-center">
        <img :src="farcasterIcon" alt="farcaster" class="w-5 h-5" />
        <span class="ml-3">Farcaster Quick Import</span>
      </div>
    </NeoButton>
    <span class="my-4 text-k-grey">- Or -</span>
    <NeoButton
      expanded
      no-shadow
      label="Start Fresh"
      class="h-14"
      @click="emit('startNew')" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
const { isDarkMode } = useTheme()

const farcasterIcon = computed(() =>
  isDarkMode.value ? '/farcaster-dark.svg' : '/farcaster-light.svg',
)
const emit = defineEmits(['startNew', 'edit', 'importFarcaster'])
</script>
