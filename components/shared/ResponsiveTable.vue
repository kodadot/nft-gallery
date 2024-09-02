<template>
  <div ref="container">
    <div
      v-if="showNoResults"
      class="flex flex-col items-center justify-center py-8"
    >
      <span class="font-bold text-xl text-center">{{ noResultsMain }}</span>
      <span class="text-k-grey">{{ noResultsSub }}</span>
    </div>
    <div v-else-if="items.length > 0 || loading">
      <div
        v-if="desktop"
        class="flex gap-3 pb-3 text-xs text-k-grey"
      >
        <slot name="columns" />
      </div>

      <NeoSkeleton
        v-if="loading"
        animated
        size="large"
        :count="3"
      />
      <slot
        v-else
        name="rows"
        :variant="variant"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'

const container = ref<HTMLDivElement | null>(null)
const { variant, desktop } = useResponsive(container)

withDefaults(
  defineProps<{
    items: any[]
    noResultsMain: string
    noResultsSub: string
    showNoResults: boolean
    loading?: boolean
  }>(),
  {
    items: () => [],
    noResultsMain: '',
    noResultsSub: '',
    showNoResults: false,
  },
)
</script>
