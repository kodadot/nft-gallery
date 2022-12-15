<template>
  <GalleryItemPriceSection title="Highest Offer" :price="price">
    <GalleryItemPriceAction :active="active">
      <template #action>
        <NeoButton
          label="Make Offer"
          size="large"
          fixed-width
          variant="k-blue"
          no-shadow
          @click.native="toggleActive" />
      </template>

      <template #content> Type Your Offer </template>
    </GalleryItemPriceAction>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemPriceAction from '../GalleryItemActionCta.vue'

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
const active = ref(false)

function toggleActive() {
  active.value = !active.value
}

watchEffect(() => {
  price.value = data.value?.offers[0]?.price || ''
})
</script>

<style scoped></style>
