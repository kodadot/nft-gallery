<template>
  <ItemsGrid
    :search="query"
    grid-size="medium"
    :grid-section="gridSection"
  />
</template>

<script lang="ts" setup>
import ItemsGrid from '@/components/items/ItemsGrid/ItemsGrid.vue'

const gridSection = GridSection.PROFILE_GALLERY

defineProps<{
  query: Record<string, any>
}>()
</script>
