<template>
  <div
    class="is-flex is-flex-direction-column"
    :class="[`nft-media-info__${variant}`, isMinimal ? 'py-3' : 'pt-2 pb-3']">
    <div class="is-flex is-flex-direction-column mb-3 px-3">
      <div class="is-flex is-justify-content-space-between">
        <span
          class="is-ellipsis has-text-weight-bold"
          data-testid="nft-name"
          :title="token.name">
          {{ token.name || '--' }}
        </span>
        <span v-if="!isMinimal">x{{ token.supply }}</span>
      </div>

      <div v-if="!isMinimal" class="is-size-7 has-text-grey">
        {{ $t('lowestPrice') }}:
        <CommonTokenMoney
          :value="token.cheapest.price"
          data-testid="card-money" />
      </div>
    </div>

    <div
      class="is-flex is-justify-content-space-between is-align-items-center px-3"
      :class="isMinimal ? '' : 'border-top card-border-color pt-3'">
      <template v-if="!isMinimal">
        <nuxt-link class="is-ellipsis pr-1" :to="collectionUrl">
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
        <nuxt-link
          class="is-size-7 has-text-grey is-ellipsis pr-1"
          :to="collectionUrl">
          {{ collectionNameLabel }}
        </nuxt-link>
        <span>x{{ token.supply }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { NeoButton, NftCardVariant } from '@kodadot1/brick'
import { TokenEntity } from '@/composables/useNft'

const props = withDefaults(
  defineProps<{
    token: TokenEntity
    prefix: string

    variant?: NftCardVariant
  }>(),
  {
    variant: 'primary',
  },
)

const isMinimal = computed(() =>
  props.variant ? props.variant.includes('minimal') : false,
)

const collectionUrl = computed(
  () => `/${props.prefix}/collection/${props.token.collection.id}`,
)

const collectionNameLabel = computed(() => props.token.collection.name || '--')
</script>

<style lang="scss" scoped>
@import './NeoNftCard.scss';
</style>
