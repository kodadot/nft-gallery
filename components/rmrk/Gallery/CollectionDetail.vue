<template>
  <div>
    <div class="is-12">
      <div class="is-flex">
        <BasicImage
          :src="image"
          :alt="name"
          custom-class="collection-card__image-wrapper-sub p-1" />
        <span class="collection-name">{{ name }}</span>
      </div>
    </div>
    <div v-if="nfts" class="is-flex is-justify-content-space-between">
      <div class="level-item column is-4 has-text-centered">
        <p class="heading--inline heading">
          {{ $t('collectionCard.volume') }}
          <CommonTokenMoney :value="collectionTradedVolumeNumber" />
        </p>
      </div>
      <div class="level-item column is-4 has-text-centered">
        <p class="heading--inline heading">
          {{ $t('collectionCard.highestSale') }}
          <CommonTokenMoney :value="collectionHighestSalePrice" />
        </p>
      </div>

      <div class="level-item column is-4 has-text-centered">
        <p class="heading--inline heading">
          {{ $t('collectionCard.items') }}
          <span class=""> {{ collectionLength }} </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Prop, Vue } from 'nuxt-property-decorator'
import { Interaction, NFT } from '@/components/rmrk/service/scheme'
import { getVolume } from '@/utils/math'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

const props = defineProps<{
  nfts: NFT[]
  name: string
  image: string
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
