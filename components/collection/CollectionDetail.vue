<template>
  <div class="collection-detail">
    <div class="collection-detail__header is-12 is-flex">
      <div class="collection-detail__header-image-wrapper">
        <BasicImage
          v-if="!isLoading"
          :src="image"
          :alt="name"
          custom-class="collection-card__image-wrapper-sub p-1" />
        <div
          v-else
          class="is-relative w-full h-full collection-card__image-wrapper-sub p-1">
          <NeoSkeleton :no-margin="true" :rounded="false" :full-size="true" />
        </div>
      </div>
      <span v-if="!isLoading" class="collection-detail__name">{{ name }}</span>
      <span v-else class="collection-detail__name">
        <NeoSkeleton :no-margin="true" size="medium" width="100px" />
      </span>
    </div>
    <div
      v-if="nfts && !isLoading"
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
    <div v-else class="is-flex is-justify-content-space-around is-vcentered">
      <div
        v-for="n in DESC_SKELETON_COUNT"
        :key="n"
        class="is-flex is-align-items-center detail-item column px-5">
        <NeoSkeleton :no-margin="true" size="medium" position="centered" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoSkeleton } from '@kodadot1/brick'
import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import { getVolume } from '@/utils/math'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const DESC_SKELETON_COUNT = 3

const props = defineProps<{
  isLoading?: boolean
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

<style lang="scss" scoped>
.collection-detail__header-image-wrapper .b-skeleton {
  height: 100%;
}
</style>
