<template>
  <GalleryItemPriceSection v-if="price" title="Highest Offer" :price="price">
    Make Offer
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import GalleryItemPriceSection from './GalleryItemPriceSection.vue'

const props = defineProps<{
  nftId: string
  account: string
}>()

const { data } = useGraphql({
  queryName: 'offerHighest',
  queryPrefix: 'chain-bsx',
  variables: {
    id: props.nftId,
    account: props.account,
  },
})

const price = ref('')

watchEffect(() => {
  price.value = data.value?.offers[0]?.price
})
</script>

<style scoped></style>
