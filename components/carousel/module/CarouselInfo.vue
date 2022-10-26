<template>
  <div class="carousel-info">
    <nuxt-link
      :to="urlOf({ id: item.id, url, chain: item.chain })"
      :class="[
        'has-text-weight-bold',
        { 'carousel-info-collection': isCollection },
      ]">
      <span class="carousel-info-name">{{ item.name }}</span>
      <span v-if="isCollection" class="carousel-info-arrow">----></span>
    </nuxt-link>

    <nuxt-link
      v-if="!isCollection && item.collectionName && item.collectionId"
      :to="
        urlOf({ id: item.collectionId, url: 'collection', chain: item.chain })
      "
      class="is-size-7 carousel-info-name">
      <p>{{ item.collectionName }}</p>
    </nuxt-link>

    <div v-if="item.price && !isCollection" class="carousel-meta">
      <CommonTokenMoney
        :custom-token-id="getTokenId(item.chain)"
        :value="item.price"
        class="has-text-weight-bold" />
      <p class="is-size-7">{{ chainName }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import type { CarouselNFT } from '@/components/base/types'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

import { useCarouselUrl } from '../utils/useCarousel'

const props = defineProps<{
  item: CarouselNFT
}>()
const { urlPrefix } = usePrefix()
const { urlOf } = useCarouselUrl()
const url = inject('itemUrl') as string
const isCollection = inject('isCollection')
const chainName = computed(() => {
  const name = {
    rmrk: 'RMRK',
    snek: 'Snek (Rococo)',
    bsx: 'Basilisk',
  }

  return name[props.item.chain || urlPrefix.value]
})
const getTokenId = (chain?: string) => {
  return chain && getKusamaAssetId(chain)
}
</script>
