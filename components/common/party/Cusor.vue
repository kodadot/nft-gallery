<template>
  <div
    class="absolute z-10 pointer-events-none transition-all"
    :class="[{ 'opacity-20': cursorDetails.ghost }]"
    :style="{
      top: `${connection.cursor?.y}px`,
      left: `${connection.cursor?.x}px`,
    }">
    <svg
      :id="`cursor-${connection.id}`"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      height="32"
      viewBox="0 0 32 32"
      width="32"
      xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd" transform="translate(10 7)">
        <path
          d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z"
          fill="#FFFFFF"></path>
        <path
          d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z"
          fill="#0066FF"></path>
      </g>
    </svg>

    <div
      v-if="cursorLabel?.label"
      class="px-[0.2rem] py-[0.1rem] ml-2 text-xs bg-neutral-3 dark:bg-neutral-11 rounded-full w-fit flex gap-1">
      <span>{{ cursorLabel.label }}</span>
      <NeoIcon v-if="cursorLabel.loading" icon="spinner-third" spin />
    </div>
    <BaseMediaItem
      v-else-if="cursorLabel?.image"
      class="ml-2 border border-k-shade w-16 h-16"
      alt="cursor minted nft"
      :src="sanitizeIpfsUrl(cursorLabel.image)"
      :animation-src="sanitizeIpfsUrl(cursorLabel.image)"
      preview
      is-detail />
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
