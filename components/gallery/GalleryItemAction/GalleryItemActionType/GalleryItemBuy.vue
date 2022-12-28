<template>
  <GalleryItemPriceSection v-if="nft?.price" title="Price" :price="nft?.price">
    <GalleryItemActionSlides
      v-if="Number(nft.price)"
      ref="actionRef"
      :active="active">
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
        <div class="has-text-centered">
          Buy NFT on
          <span class="has-text-weight-bold is-uppercase">{{ urlPrefix }}</span>
        </div>
      </template>
    </GalleryItemActionSlides>
    <div v-else>Not Listed</div>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { onClickOutside } from '@vueuse/core'

import { useGalleryItem } from '../../useGalleryItem'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'

const { urlPrefix } = usePrefix()
const { nft } = useGalleryItem()

const active = ref(false)
const label = computed(() => (active.value ? 'Confirm' : 'Buy'))

function toggleActive() {
  active.value = !active.value
}

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.dark-mode {
  .slide {
    box-shadow: 4px 4px 0 white;
  }

  .is-neo {
    background: $k-accent;
    color: black;

    &:hover {
      background: $k-dark;
      color: white;
    }
  }
}

.is-neo {
  &:hover {
    background: white;
  }
}
</style>
