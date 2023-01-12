<template>
  <div class="collection-detail">
    <div class="collection-detail__header is-12 is-flex">
      <div class="collection-detail__header-image-wrapper">
        <BasicImage
          :src="image"
          :alt="name"
          custom-class="collection-card__image-wrapper-sub p-1" />
      </div>
      <span class="collection-detail__name">{{ name }}</span>
    </div>
    <div
      v-if="nfts"
      class="is-flex is-justify-content-space-around is-vcentered">
      <div class="detail-item has-text-centered column">
        <p class="detail-item__title has-text-grey">
          {{ $t('collectionCard.volume') }}
        </p>
        <CommonTokenMoney :value="collectionTradedVolumeNumber" />
      </div>
      <div class="detail-item has-text-centered column">
        <p class="detail-item__title has-text-grey">
          {{ $t('series.highestSale') }}
        </p>
        <CommonTokenMoney :value="collectionHighestSalePrice" />
      </div>

      <div class="detail-item has-text-centered column">
        <p class="detail-item__title has-text-grey">
          {{ $t('collectionCard.items') }}
        </p>
        {{ collectionLength }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import { getVolume } from '@/utils/math'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const props = defineProps<{
  nfts: NFT[]
  name: string
  image?: string
}>()

const saleEvents = computed((): Interaction[] => {
  return props.nfts.map((nft) => nft.events).flat()
})
const collectionLength = computed((): number => {
  return props.nfts.length
})

const collectionHighestSalePrice = computed((): number => {
  return Math.max(...saleEvents.value.map((event) => Number(event.meta)))
})

const collectionTradedVolumeNumber = computed((): bigint => {
  return getVolume(saleEvents.value)
})
</script>
