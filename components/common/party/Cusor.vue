<template>
  <div
    class="absolute z-[998] pointer-events-none transition-all"
    :class="[{ 'opacity-20': cursorDetails.ghost }]"
    :style="{
      top: `${connection.cursor?.y}px`,
      left: `${connection.cursor?.x}px`,
    }">
    <NeoIcon
      :id="`cursor-${connection.id}`"
      icon="arrow-pointer"
      pack="fas"
      :class="cursorDetails.color" />

    <div
      v-if="cursorLabel"
      class="px-[0.2rem] py-[0.1rem] ml-2 text-xs bg-neutral-3 dark:bg-neutral-11 rounded-full w-fit flex gap-1">
      <span>{{ cursorLabel.label }}</span>
      <NeoIcon v-if="cursorLabel.loading" icon="spinner-third" spin />
    </div>
    <div v-else class="ml-2">
      <BaseMediaItem
        class="border border-k-shade w-16 h-16"
        alt="cursor minted nft"
        :src="sanitizeIpfsUrl(cursorLabel.image)"
        :animation-src="sanitizeIpfsUrl(cursorLabel.image)"
        preview
        is-detail />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserDetails } from '@/composables/party/types'
import { NeoIcon } from '@kodadot1/brick'
import { CursorDetails, CursorLabel } from './CursorParty.vue'

const props = defineProps<{
  connection: UserDetails
  cursorDetails: CursorDetails
}>()

const cursorLabel = computed<CursorLabel>(() => props.cursorDetails.label)
</script>
