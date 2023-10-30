<template>
  <div class="carousel-info is-flex is-flex-direction-column">
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
      class="carousel-meta is-flex"
      :class="[
        showPrice
          ? 'is-justify-content-space-between'
          : 'is-justify-content-end',
      ]">
      <Money
        v-if="showPrice"
        :value="item.price"
        inline
        :prefix="item.chain"
        :unit-symbol="unitSymbol" />
      <p class="is-size-7 chain-name is-capitalized">{{ chainName }}</p>
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

const showPrice = computed((): boolean => {
  return Number(props.item.price) > 0 && !isCollection
})

const unitSymbol = computed(() => prefixToToken[props.item.chain || 'ksm'])
</script>
