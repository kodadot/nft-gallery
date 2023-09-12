<template>
  <div class="nft-card" :class="{ loading: isLoading }">
    <component
      :is="link"
      v-if="!isLoading && nft"
      :[bindKey]="`/${prefix}/gallery/${nft.id}`">
      <img
        v-if="unlockable && unloackableIcon"
        class="unloackable-icon"
        :src="unloackableIcon"
        alt="Unlockable Icon" />
      <div
        class="is-relative"
        :class="{ 'border border-k-shade ml-5 mt-5 mr-2': isStacked }">
        <MediaItem
          :key="nft.image"
          class="nft-media"
          :class="{ 'stacked-shadow is-relative ': isStacked }"
          :src="nft.image"
          :animation-src="nft.animationUrl"
          :mime-type="nft.mimeType"
          :placeholder="placeholder"
          :title="nft?.name" />
        <div
          :class="[showActionOnHover ? 'show-on-hover' : 'show-always']"
          class="w-full is-flex is-justify-content-center action-container">
          <slot name="action" />
        </div>
      </div>
      <div
        v-if="!isStacked"
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
              variant !== 'minimal' &&
              (nft.collection.name || nft.collection.id)
            "
            :show-delay="collectionPopoverShowDelay"
            :nft="nft"
            class="is-ellipsis">
            <template #trigger>
              <a
                v-safe-href="`/${prefix}/collection/${nft.collection.id}`"
                :title="nft.collectionName || nft.collection.name"
                class="is-size-7 nft-info-collection-name">
                {{ nft.collection.name || '--' }}
              </a>
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

      <div
        v-else
        class="nft-media-info is-flex is-flex-direction-column p-0"
        :class="`nft-media-info__${variant}`">
        <div class="is-flex is-flex-direction-column border-bottom p-3">
          <div class="is-flex is-justify-content-space-between">
            <span
              class="is-ellipsis has-text-weight-bold"
              data-testid="nft-name"
              :title="nft.name"
              >{{ nft.name || '--' }}
            </span>
            <span v-if="!isMinimal">X{{ nft.count }}</span>
          </div>

          <div v-if="!isMinimal" class="is-size-7 has-text-grey">
            Floor:
            <CommonTokenMoney
              :value="nft.floorPrice"
              data-testid="card-money" />
          </div>
        </div>
      </div>
    </component>

    <template v-else>
      <div class="media-object nft-media">
        <div class="is-square image">
          <NeoSkeleton :rounded="false" full-size no-margin />
        </div>
      </div>
      <div class="nft-media-info" :class="`nft-media-info__${variant}`">
        <NeoSkeleton size="medium" no-margin />
        <div v-if="!isMinimal" class="is-flex mt-2">
          <NeoSkeleton
            size="small"
            position="centered"
            no-margin
            width="150px" />
        </div>
        <div class="is-flex mt-4">
          <NeoSkeleton size="small" no-margin width="100px" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import MediaItem from '../MediaItem/MediaItem.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { getChainNameByPrefix } from '@/utils/chain'
import { NeoSkeleton, NftCardVariant } from '@kodadot1/brick'
import { NFTWithMetadata } from '@/composables/useNft'

const props = withDefaults(
  defineProps<{
    isLoading?: boolean
    nft?: NFTWithMetadata
    prefix?: string
    showPrice?: boolean
    collectionPopoverShowDelay?: number
    variant?: NftCardVariant
    placeholder?: string
    unlockable?: boolean
    unloackableIcon?: string
    link?: string
    bindKey?: string
    showActionOnHover?: boolean
  }>(),
  {
    collectionPopoverShowDelay: 500,
    variant: 'primary',
    unloackableIcon: undefined,
    link: 'a',
    bindKey: 'href',
    showActionOnHover: true,
  }
)

const isStacked = computed(() => {
  if (props.variant) {
    return props.variant.includes('stacked')
  }
  return false
})

const isMinimal = computed(() => {
  if (props.variant) {
    return props.variant.includes('minimal')
  }
  return false
})
</script>

<style lang="scss" scoped>
@import './NeoNftCard.scss';
</style>
