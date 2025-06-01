<template>
  <div
    class="absolute z-10 pointer-events-none transition-all"
    :class="[{ 'opacity-20': cursorDetails.ghost }]"
    :style="{
      top: `${connection.cursor?.y}px`,
      left: `${connection.cursor?.x}px`,
    }"
  >
    <KIcon
      :id="`cursor-${connection.id}`"
      name="i-mdi:cursor-default-outline"
      :class="color"
    />

    <div
      v-if="cursorLabel?.label"
      class="px-[0.2rem] py-[0.1rem] ml-2 text-xs bg-neutral-3 dark:bg-neutral-11 rounded-full w-fit flex gap-1"
    >
      <span>{{ cursorLabel.label }}</span>
      <KIcon
        v-if="cursorLabel.loading"
        name="i-mdi:loading"
        class="animate-spin"
      />
    </div>
    <div v-else-if="cursorLabel?.mintingSession">
      <BaseMediaItem
        class="ml-2 border border-k-shade w-16 h-16"
        alt="cursor minted nft"
        :src="sanitizeIpfsUrl(cursorLabel?.mintingSession?.image)"
        :animation-src="sanitizeIpfsUrl(cursorLabel?.mintingSession?.image)"
        preview
        is-detail
      />
      <div
        v-if="cursorLabel?.mintingSession?.amount > 1"
        class="bg-k-grey-light px-1 py-[0.125rem] text-center rounded-full text-xs w-8 absolute bottom-[-10px] left-[-7px]"
      >
        +{{ cursorLabel?.mintingSession?.amount - 1 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CursorDetails, CursorLabel } from './CursorParty.vue'
import type { UserDetails } from '@/composables/party/types'

const props = defineProps<{
  connection: UserDetails
  cursorDetails: CursorDetails
}>()

const cursorLabel = computed<CursorLabel>(() => props.cursorDetails.label)

const color = props.cursorDetails.color()
</script>
