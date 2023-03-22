<template>
  <div
    class="is-flex is-justify-content-space-between mobile-flex-direction-column gap">
    <div class="is-flex is-flex-direction-column is-flex-grow-1 max-width">
      <HeroButtons class="is-hidden-tablet" />
      <div v-if="collectionInfo?.currentOwner" class="is-flex mb-2">
        <div class="mr-2">{{ $t('activity.creator') }}</div>
        <nuxt-link :to="`/${urlPrefix}/u/${address}`" class="has-text-link">
          <IdentityIndex ref="identity" :address="address" show-clipboard />
        </nuxt-link>
      </div>
      <div class="overflow-wrap">
        {{ collectionInfo?.meta.description }}
      </div>
    </div>
    <div>
      <div class="columns is-mobile">
        <div class="column">
          <CollectionInfoLine :title="$t('activity.network')" :value="chain" />
          <CollectionInfoLine title="Items" :value="stats.collectionLength" />
          <CollectionInfoLine
            :title="$t('series.owners')"
            :value="stats.uniqueOwners" />
        </div>
        <div class="column">
          <CollectionInfoLine :title="$t('activity.floor')">
            <CommonTokenMoney
              :value="stats.collectionFloorPrice"
              inline
              :round="2" />
          </CollectionInfoLine>
          <CollectionInfoLine
            v-if="stats.bestOffer"
            :title="$t('activity.bestOffer')">
            <CommonTokenMoney :value="stats.bestOffer" inline :round="2" />
          </CollectionInfoLine>
          <CollectionInfoLine :title="$t('activity.volume')">
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
import CollectionInfoLine from './collectionInfoLine.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import IdentityIndex from '@/components/identity/IdentityIndex.vue'
import HeroButtons from '@/components/collection/HeroButtons.vue'

import {
  useCollectionDetails,
  useCollectionMinimal,
} from './utils/useCollectionDetails'

const route = useRoute()
const { urlPrefix } = usePrefix()
const { availableChains } = useChain()

const collectionId = computed(() => route.params.id)
const chain = computed(
  () =>
    availableChains.value.find((chain) => chain.value === route.params.prefix)
      .text
)
const address = computed(() => collectionInfo.value?.currentOwner)

const { collection: collectionInfo } = useCollectionMinimal({
  collectionId: collectionId.value,
})
const { stats } = useCollectionDetails({ collectionId: collectionId.value })
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.max-width {
  max-width: 50%;
}

.gap {
  gap: 1rem;
}

@include mobile {
  .mobile-flex-direction-column {
    flex-direction: column;
  }

  .max-width {
    max-width: 100%;
  }
  .overflow-wrap {
    overflow-wrap: break-word;
  }
}
</style>
