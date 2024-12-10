<template>
  <div>
    <MultiItemMedia
      :items="items"
    />
  </div>
</template>

<script lang="ts" setup>
import type { ItemMedia } from '@/components/common/successfulModal/SuccessfulItemsMedia.vue'

const props = defineProps<{
  items: ListCartItem[]
}>()

const items = computed<ItemMedia[]>(() =>
  props.items.map(item => ({
    id: item.id,
    image: item.meta?.image as string,
    name: item.name,
    collection: item.collection.id,
    collectionName: item.collection.name,
  }) as ItemMedia),
)
</script>
