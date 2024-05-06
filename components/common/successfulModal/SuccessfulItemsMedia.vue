<template>
  <SingleItemMedia
    v-if="isSingleItem"
    :header="header.single"
    :src="sanitizeIpfsUrl(item.image)"
    :nft-name="item.name"
    :collection-id="item.collection"
    :collection-name="item.collectionName"
    :media-mime-type="item.mimeType"
    :price="item.price"
    :show-price="showPrice" />
  <MultiItemMedia
    v-else
    :header="header.multiple"
    :items="items"
    :show-price="showPrice" />
</template>
<script lang="ts" setup>
export type ItemMedia = {
  id: string
  image: string
  name: string
  collection: string
  collectionName: string
  price?: string
  mimeType?: string
}

const props = defineProps<{
  header: { single: string; multiple: string }
  items: ItemMedia[]
  showPrice?: boolean
}>()

const isSingleItem = computed(() => props.items.length === 1)
const item = computed(() => props.items[0])
</script>
