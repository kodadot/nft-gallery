<template>
  <GalleryItemPriceSection v-if="nft?.price" title="Price" :price="nft?.price">
    <GalleryItemActionSlides
      v-if="Number(nft.price)"
      ref="actionRef"
      :active="active">
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
    </GalleryItemActionSlides>
    <GalleryItemActionSlides v-else :active="active">
      <template #action>
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
        </div>
      </template>
    </GalleryItemActionSlides>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { onClickOutside } from '@vueuse/core'

import { useGalleryItem } from '../../useGalleryItem'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'

const { nft } = useGalleryItem()

const active = ref(false)

function toggleActive() {
  active.value = !active.value
}

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))
</script>

<style lang="scss" scoped></style>
