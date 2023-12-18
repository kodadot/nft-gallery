<template>
  <div class="flex justify-between mobile-flex-direction-column gap">
    <div class="flex flex-col flex-grow max-width">
      <HeroButtons class="is-hidden-tablet" />
      <div v-if="address" class="flex mb-2">
        <div class="mr-2">{{ $t('activity.creator') }}</div>
        <nuxt-link
          :to="`/${urlPrefix}/u/${address}`"
          class="has-text-link"
          data-testid="collection-creator-address">
          <IdentityIndex ref="identity" :address="address" show-clipboard />
        </nuxt-link>
      </div>
      <div v-if="recipient" class="flex mb-2">
        <div class="mr-2 is-capitalized">{{ $t('royalty') }}</div>
        <nuxt-link :to="`/${urlPrefix}/u/${recipient}`" class="has-text-link">
          <IdentityIndex ref="identity" :address="recipient" show-clipboard />
        </nuxt-link>
        &nbsp;({{ royalty }}%)
      </div>
      <div class="overflow-wrap">
        <Markdown
          :source="visibleDescription"
          data-testid="collection-description" />
      </div>
      <NeoButton
        v-if="hasSeeAllDescriptionOption"
        class="no-shadow is-text is-underlined has-text-left p-0"
        :label="seeAllDescription ? $t('showLess') : $t('showMore')"
        data-testid="description-show-less-more-button"
        @click="toggleSeeAllDescription" />
    </div>
    <div>
      <div class="flex gap mobile-flex-direction-column mobile-no-gap">
        <div>
          <CollectionInfoLine :title="$t('activity.network')" :value="chain" />
          <CollectionInfoLine title="Items" :value="stats.collectionLength" />
          <CollectionInfoLine
            :title="$t('series.owners')"
            :value="stats.uniqueOwners" />
        </div>
        <div>
          <CollectionInfoLine
            v-if="isAssetHub"
            :title="$t('activity.totalSupply')"
            :value="stats.maxSupply || $t('helper.unlimited')" />
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
import { NeoButton } from '@kodadot1/brick'

import {
  useCollectionDetails,
  useCollectionMinimal,
} from './utils/useCollectionDetails'

const route = useRoute()
const { urlPrefix } = usePrefix()
const { availableChains } = useChain()
const { isAssetHub } = useIsChain(urlPrefix)
const collectionId = computed(() => route.params.id)
const chain = computed(
  () =>
    availableChains.value.find((chain) => chain.value === route.params.prefix)
      ?.text,
)
const address = computed(() => collectionInfo.value?.currentOwner)
const recipient = computed(() => collectionInfo.value?.recipient)
const royalty = computed(() => collectionInfo.value?.royalty)
const seeAllDescription = ref(false)
const DESCRIPTION_MAX_LENGTH = 210

const toggleSeeAllDescription = () => {
  seeAllDescription.value = !seeAllDescription.value
}

const hasSeeAllDescriptionOption = computed(() => {
  return (
    (collectionInfo.value?.meta?.description?.length || 0) >
    DESCRIPTION_MAX_LENGTH
  )
})

const visibleDescription = computed(() => {
  const desc = collectionInfo.value?.meta?.description

  return (
    (!hasSeeAllDescriptionOption.value || seeAllDescription.value
      ? desc
      : desc?.slice(0, DESCRIPTION_MAX_LENGTH)
    )?.replaceAll('\n', '  \n') || ''
  )
})

const { collection: collectionInfo } = useCollectionMinimal({
  collectionId: collectionId.value,
})
const { stats } = useCollectionDetails({
  collectionId: collectionId.value,
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
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

  .mobile-no-gap {
    gap: 0;
  }
  .max-width {
    max-width: 100%;
  }
  .overflow-wrap {
    overflow-wrap: break-word;
  }
}
</style>
