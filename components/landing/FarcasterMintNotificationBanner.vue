<template>
  <a
    v-safe-href="config.url"
    target="_blank"
    class="hover:text-text-color flex items-center p-2 gap-[10px] bg-background-color border border-text-color rounded-[1.5rem]">
    <img :src="config.image" class="w-[38px] h-[38px] rounded-[14px]" />

    <div
      class="bg-k-red-accent-2 flex flex-wrap gap-2 px-3 py-2 rounded-[14px]">
      <div class="font-bold">{{ config.name }}</div>
      <div class="capitalize">{{ $t('landing.farcasterMintLive') }}</div>
    </div>
    <NeoIcon icon="arrow-right" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
defineProps<{
  config: {
    url: string
    image: string
    name: string
  }
}>()
</script>
