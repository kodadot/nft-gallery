<template>
  <div
    class="py-3 is-flex is-flex-direction-column"
    :class="`nft-media-info__${variant}`">
    <div class="is-flex is-flex-direction-column mb-3 px-3">
      <div class="is-flex is-justify-content-space-between">
        <span
          class="is-ellipsis has-text-weight-bold"
          data-testid="nft-name"
          :title="nft.name">
          {{ nft.name || '--' }}
        </span>
        <span v-if="!isMinimal">X{{ nft.count }}</span>
      </div>

      <div v-if="!isMinimal" class="is-size-7 has-text-grey">
        Floor:
        <CommonTokenMoney :value="nft.floorPrice" data-testid="card-money" />
      </div>
    </div>

    <div
      class="is-flex is-justify-content-space-between is-align-items-center px-3"
      :class="isMinimal ? '' : 'border-top card-border-color pt-3'">
      <template v-if="!isMinimal">
        <nuxt-link :to="collectionUrl">
          {{ collectionNameLabel }}
        </nuxt-link>
        <NeoButton
          no-shadow
          variant="text"
          tag="nuxt-link"
          :to="collectionUrl"
          class="is-size-7 has-text-grey"
          label="Visit"
          icon="arrow-right" />
      </template>

      <template v-else>
        <nuxt-link class="is-size-7 has-text-grey" :to="collectionUrl">
          {{ collectionNameLabel }}
        </nuxt-link>
        <span>X{{ nft.count }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { NeoButton, NftCardVariant } from '@kodadot1/brick'
import { NFTWithMetadata } from '@/composables/useNft'

const props = withDefaults(
  defineProps<{
    nft: NFTWithMetadata
    prefix?: string

    variant?: NftCardVariant
  }>(),
  {
    variant: 'primary',
  }
)

const isMinimal = computed(() => {
  if (props.variant) {
    return props.variant.includes('minimal')
  }
  return false
})

const collectionUrl = computed(
  () => `/${props.prefix}/collection/${props.nft.collection.id}`
)

const collectionNameLabel = computed(() => props.nft.collection.name || '--')
</script>

<style lang="scss" scoped>
@import './NeoNftCard.scss';
</style>
