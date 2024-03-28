<template>
  <div
    class="absolute z-10 pointer-events-none transition-all"
    :class="[{ 'opacity-20': cursorDetails.ghost }]"
    :style="{
      top: `${connection.cursor?.y}px`,
      left: `${connection.cursor?.x}px`,
    }">
    <NeoIcon
      :id="`cursor-${connection.id}`"
      icon="arrow-pointer"
      pack="fas"
      :class="color" />

    <div
      v-if="cursorLabel?.label"
      class="px-[0.2rem] py-[0.1rem] ml-2 text-xs bg-neutral-3 dark:bg-neutral-11 rounded-full w-fit flex gap-1">
      <span>{{ cursorLabel.label }}</span>
      <NeoIcon v-if="cursorLabel.loading" icon="spinner-third" spin />
    </div>
    <div v-else-if="cursorLabel?.mintingSession">
      <BaseMediaItem
        class="ml-2 border border-k-shade w-16 h-16"
        alt="cursor minted nft"
        :src="sanitizeIpfsUrl(cursorLabel?.mintingSession?.image)"
        :animation-src="sanitizeIpfsUrl(cursorLabel?.mintingSession?.image)"
        preview
        is-detail />
      <div
        v-if="cursorLabel?.mintingSession?.amount > 1"
        class="bg-k-grey-light px-1 py-[0.125rem] text-center rounded-full text-xs w-8 absolute bottom-[-10px] left-[-7px]">
        +{{ cursorLabel?.mintingSession?.amount - 1 }}
      </div>
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

const color = props.cursorDetails.color()
</script>
