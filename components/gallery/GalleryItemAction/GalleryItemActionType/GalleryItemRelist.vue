<template>
  <GalleryItemPriceSection v-if="nft?.price" title="Price" :price="nft?.price">
    <GalleryItemPriceAction v-if="Number(nft.price)" :active="active">
      <template #action>
        <NeoButton
          label="Change Price"
          size="large"
          fixed-width
          no-shadow
          @click.native="toggleActive" />
      </template>

      <template #content>
        <div>
          <input type="number" placeholder="Your New Price" />
        </div>
      </template>
    </GalleryItemPriceAction>
    <GalleryItemPriceAction v-else :active="active"
      ><template #action>
        <NeoButton
          label="List"
          size="large"
          fixed-width
          no-shadow
          variant="k-accent"
          @click.native="toggleActive" />
      </template>

      <template #content>
        <div>
          <input type="number" placeholder="Your Listing Price" />
        </div> </template
    ></GalleryItemPriceAction>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

import { useGalleryItem } from '../../useGalleryItem'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemPriceAction from '../GalleryItemActionCta.vue'

const { nft } = useGalleryItem()

const active = ref(false)

function toggleActive() {
  active.value = !active.value
}
</script>

<style lang="scss" scoped></style>
