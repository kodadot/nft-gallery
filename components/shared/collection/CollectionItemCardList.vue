<template>
  <div :id="INFINITE_SCROLL_CONTAINER_ID" class="columns is-multiline">
    <div
      v-for="collection in collections"
      :key="collection.id"
      :class="`column ${classLayout} column-padding ${INFINITE_SCROLL_ITEM_CLASS_NAME}`">
      <CollectionCard :collection="collection" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CollectionWithMeta } from '@/components/rmrk/service/scheme'
import {
  INFINITE_SCROLL_CONTAINER_ID,
  INFINITE_SCROLL_ITEM_CLASS_NAME,
} from '@/utils/mixins/infiniteScrollMixin'
import CollectionCard from '@/components/collection/CollectionCard'

defineProps<{ collections: CollectionWithMeta[] }>()
const { $store } = useNuxtApp()

const classLayout = computed(() => $store.getters['preferences/getLayoutClass'])
</script>
