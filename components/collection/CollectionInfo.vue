<template>
  <div class="is-flex is-justify-content-space-between flex-direction">
    <div class="is-flex is-flex-direction-column limit-width">
      <div v-if="collectionInfo?.currentOwner" class="is-flex mb-2">
        <div class="mr-2">{{ $i18n.t('activity.creator') }}</div>
        <IdentityIndex
          :address="address"
          hide-identity-popover
          :show-clipboard="false"
          class="has-text-link" />
      </div>
      <div>
        {{ collectionInfo?.meta.description }}
      </div>
    </div>
    <div>
      <div class="columns is-mobile">
        <div class="column">
          <CollectionInfoLine
            :title="`${$i18n.t('activity.network')}`"
            :value="chain" />
          <CollectionInfoLine
            title="Items"
            :value="representation(stats.collectionLength)" />
          <CollectionInfoLine
            :title="`${$i18n.t('series.owners')}`"
            :value="representation(stats.uniqueOwners)" />
        </div>
        <div class="column">
          <CollectionInfoLine :title="`${$i18n.t('activity.floor')}`">
            <CommonTokenMoney
              :value="stats.collectionFloorPrice"
              inline
              :round="2" />
          </CollectionInfoLine>
          <CollectionInfoLine :title="`${$i18n.t('activity.bestOffer')}`">
            <CommonTokenMoney :value="stats.bestOffer" inline :round="2" />
          </CollectionInfoLine>
          <CollectionInfoLine :title="`${$i18n.t('activity.volume')}`">
            <CommonTokenMoney
              :value="stats.collectionTradedVolumeNumber"
              inline
              :round="2" />
          </CollectionInfoLine>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// TODO
// which network collection belongs to?
// offers on RMRK? what to show instead?
// limit height of collection description?

import CollectionInfoLine from './collectionInfoLine.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import IdentityIndex from '@/components/identity/IdentityIndex.vue'
import {
  useCollectionDetails,
  useCollectionMinimal,
} from './utils/useCollectionDetails'

const route = useRoute()
const { availableChains } = useChain()

const collectionId = computed(() => route.params.id)
const chain = computed(
  () =>
    availableChains.value.find((chain) => chain.value === route.params.prefix)
      .text
)
const address = computed(() => `${collectionInfo.value?.currentOwner}`)

const { collection: collectionInfo } = useCollectionMinimal({
  collectionId: collectionId.value,
})
const { stats } = useCollectionDetails({ collectionId: collectionId.value })

const representation = (value: number | undefined): string => {
  if (value == undefined) {
    return '0'
  }

  if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'K'
  }
  return `${value}`
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.limit-width {
  max-width: 320px;
}

.flex-direction {
  flex-direction: row;
}

@include mobile {
  .flex-direction {
    flex-direction: column;
    gap: 1rem;
  }

  .limit-width {
    max-width: 100%;
  }
}
.has-text-link {
  a {
    color: inherit;
  }
}
</style>

<style lang="scss">
.has-text-link {
  a {
    color: inherit !important;
  }
}
</style>
