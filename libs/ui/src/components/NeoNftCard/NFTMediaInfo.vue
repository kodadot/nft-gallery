<template>
  <div
    class="nft-media-info is-flex is-flex-direction-column"
    :class="`nft-media-info__${variant}`">
    <div class="is-flex is-flex-direction-column">
      <span
        class="is-ellipsis has-text-weight-bold"
        data-testid="nft-name"
        :title="nft.name"
        >{{ nft.name || '--' }}</span
      >

      <CollectionDetailsPopover
        v-if="
          variant !== 'minimal' && (nft.collection.name || nft.collection.id)
        "
        :show-delay="collectionPopoverShowDelay"
        :nft="nft"
        class="is-ellipsis">
        <template #trigger>
          <nuxt-link
            :to="`/${prefix}/collection/${nft.collection.id}`"
            class="is-size-7 nft-info-collection-name">
            {{ nft.collection.name || '--' }}
          </nuxt-link>
        </template>
      </CollectionDetailsPopover>
    </div>

    <div
      class="is-flex is-align-items-center mt-2 is-ellipsis nft-media-info-footer"
      :class="[
        showPrice
          ? 'is-justify-content-space-between'
          : 'is-justify-content-end',
      ]">
      <CommonTokenMoney
        v-if="showPrice"
        :value="nft.price"
        data-testid="card-money" />
      <span v-if="!isMinimal" class="chain-name is-capitalized is-size-7">{{
        getChainNameByPrefix(prefix)
      }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { getChainNameByPrefix } from '@/utils/chain'
import { NftCardVariant } from '@kodadot1/brick'
import { NFTWithMetadata } from '@/composables/useNft'
const props = withDefaults(
  defineProps<{
    nft: NFTWithMetadata
    prefix: string
    showPrice?: boolean
    collectionPopoverShowDelay?: number
    variant?: NftCardVariant
  }>(),
  {
    collectionPopoverShowDelay: 500,
    variant: 'primary',
  }
)

const isMinimal = computed(() =>
  props.variant ? props.variant.includes('minimal') : false
)
</script>

<style lang="scss" scoped>
@import './NeoNftCard.scss';
</style>
