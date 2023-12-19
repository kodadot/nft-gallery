<template>
  <div class="carousel-info flex flex-col">
    <nuxt-link
      :to="urlOf({ id: item.id, url, chain: item.chain })"
      :title="item.name"
      :class="[
        'has-text-weight-bold carousel-info-name',
        { 'carousel-info-collection': isCollection },
      ]">
      <span class="is-ellipsis">{{ item.name || '--' }}</span>
      <span v-if="isCollection" class="carousel-info-arrow">----></span>
    </nuxt-link>
    <CollectionDetailsPopover v-if="item?.collectionId" :nft="item">
      <template #content>
        <nuxt-link
          v-if="!isCollection && item.collectionId"
          :to="
            urlOf({
              id: item.collectionId,
              url: 'collection',
              chain: item.chain,
            })
          "
          class="is-size-7 carousel-info-collection-name is-ellipsis">
          {{ item.collectionName || '--' }}
        </nuxt-link>
      </template>
    </CollectionDetailsPopover>

    <div
      v-if="!isCollection"
      class="carousel-meta flex"
      :class="[showPrice ? 'justify-between' : 'justify-end']">
      <div v-if="showPrice" class="flex items-center">
        <Money
          :value="price"
          inline
          :prefix="item.chain"
          :unit-symbol="unitSymbol" />
        <span v-if="showSold" class="ml-2 has-text-grey is-size-7"
          >- {{ $t('spotlight.sold') }}</span
        >
      </div>
      <p class="is-size-7 chain-name capitalize">{{ chainName }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Money from '@/components/shared/format/Money.vue'
import type { CarouselNFT } from '@/components/base/types'
import { getChainNameByPrefix } from '@/utils/chain'
import { useCarouselUrl } from '../utils/useCarousel'
import { prefixToToken } from '@/components/common/shoppingCart/utils'

const CollectionDetailsPopover = defineAsyncComponent(
  () =>
    import(
      '@/components/collectionDetailsPopover/CollectionDetailsPopover.vue'
    ),
)

const props = defineProps<{
  item: CarouselNFT
}>()
const { urlPrefix } = usePrefix()
const { urlOf } = useCarouselUrl()
const url = inject('itemUrl', 'gallery') as string
const isCollection = inject<boolean>('isCollection', false)
const chainName = computed(() => {
  return getChainNameByPrefix(props.item.chain || urlPrefix.value)
})

const price = computed(() => props.item.latestSalePrice ?? props.item.price)
const showSold = computed(() => Number(props.item.latestSalePrice) > 0)

const showPrice = computed((): boolean => {
  return Number(price.value) > 0 && !isCollection
})

const unitSymbol = computed(() => prefixToToken[props.item.chain || 'ksm'])
</script>
