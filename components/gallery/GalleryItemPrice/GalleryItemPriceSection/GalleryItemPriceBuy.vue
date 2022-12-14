<template>
  <GalleryItemPriceSection v-if="nft?.price" title="Price" :price="nft?.price">
    <GalleryItemPriceAction v-if="Number(nft.price)" :active="active">
      <template #action>
        <NeoButton
          :label="label"
          size="large"
          fixed-width
          variant="k-accent"
          no-shadow
          @click.native="toggleActive" />
      </template>

      <template #content>
        <div>
          Buy NFT on
          <span class="has-text-weight-bold is-uppercase">{{ urlPrefix }}</span>
        </div>
      </template>
    </GalleryItemPriceAction>
    <div v-else>Not Listed</div>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

import { useGalleryItem } from '../../useGalleryItem'
import GalleryItemPriceSection from '../GalleryItemPriceSection.vue'
import GalleryItemPriceAction from '../GalleryItemPriceAction.vue'

const { urlPrefix } = usePrefix()
const { nft } = useGalleryItem()

const active = ref(false)
const label = computed(() => (active.value ? 'Confirm' : 'Buy'))

function toggleActive() {
  active.value = !active.value
}
</script>

<style lang="scss" scoped></style>
