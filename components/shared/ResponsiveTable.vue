<template>
  <div ref="container">
    <div v-if="items.length > 0">
      <div v-if="desktop" class="columns is-size-7 has-text-grey">
        <slot name="columns" />
      </div>

      <slot name="rows" :variant="variant" />
    </div>
    <div
      v-if="!items.length"
      class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center py-8">
      <span class="has-text-weight-bold is-size-5 has-text-centered">{{
        noResultsMain
      }}</span>
      <span class="has-text-grey">{{ noResultsSub }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, withDefaults } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const desktop = ref(true)
const desktopBreakPoint = 1024
const container = ref<HTMLDivElement | null>(null)
const variant = computed(() => (desktop.value ? 'Desktop' : 'Touch'))

withDefaults(
  defineProps<{
    items: any[]
    noResultsMain: string
    noResultsSub: string
  }>(),
  {
    items: () => [],
    noResultsMain: '',
    noResultsSub: '',
  }
)

useResizeObserver(container, (entry) => {
  if (entry[0].contentRect.width >= desktopBreakPoint) {
    desktop.value = true
  } else {
    desktop.value = false
  }
})
</script>
