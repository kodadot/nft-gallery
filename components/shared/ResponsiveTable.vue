<template>
  <div ref="container">
    <div
      v-if="showNoResults"
      class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center py-8">
      <span class="has-text-weight-bold is-size-5 has-text-centered">{{
        noResultsMain
      }}</span>
      <span class="has-text-grey">{{ noResultsSub }}</span>
    </div>
    <div v-else-if="items.length > 0">
      <div v-if="desktop" class="columns is-size-7 has-text-grey">
        <slot name="columns" />
      </div>
      <slot name="rows" :variant="variant" />
    </div>
  </div>
</template>

<script setup lang="ts">
const container = ref<HTMLDivElement | null>(null)
const { variant, desktop } = useResponsive(container)

withDefaults(
  defineProps<{
    items: any[]
    noResultsMain: string
    noResultsSub: string
    showNoResults: boolean
  }>(),
  {
    items: () => [],
    noResultsMain: '',
    noResultsSub: '',
    showNoResults: false,
  }
)
</script>
