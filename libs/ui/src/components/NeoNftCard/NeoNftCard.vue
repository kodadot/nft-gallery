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
      <div class="is-relative">
        <MediaItem
          :key="nft.image"
          class="nft-media"
          :src="nft.image"
          :animation-src="nft.animationUrl"
          :placeholder="placeholder"
          :title="nft?.name" />
        <div
          class="show-on-hover w-full is-flex is-justify-content-center hover-action-container">
          <slot name="hover-action" />
        </div>
      </div>
      <div
        class="nft-media-info is-flex is-flex-direction-column"
        :class="`nft-media-info__${variant}`">
        <div class="is-flex is-flex-direction-column">
          <span
            class="is-ellipsis has-text-weight-bold"
            data-cy="nft-name"
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
                :title="nft.collectionName || nft.collection.name"
                :href="`/${prefix}/collection/${nft.collection.id}`"
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
            data-cy="card-money" />
          <span
            v-if="variant !== 'minimal'"
            class="chain-name is-capitalized is-size-7"
            >{{ getChainNameByPrefix(prefix) }}</span
          >
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
        <div v-if="variant !== 'minimal'" class="is-flex mt-2">
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
import type { NFT } from '@/components/rmrk/service/scheme'
import { getChainNameByPrefix } from '@/utils/chain'
import { NeoSkeleton, NftCardVariant } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    isLoading?: boolean
    nft?: NFT
    prefix?: string
    showPrice?: boolean
    collectionPopoverShowDelay?: number
    variant?: NftCardVariant
    placeholder?: string
    unlockable?: boolean
    unloackableIcon?: string
    link?: string
    bindKey?: string
  }>(),
  {
    collectionPopoverShowDelay: 500,
    variant: 'primary',
    unloackableIcon: undefined,
    link: 'a',
    bindKey: 'href',
  }
)
</script>

<style lang="scss" scoped>
@import './NeoNftCard.scss';
</style>
