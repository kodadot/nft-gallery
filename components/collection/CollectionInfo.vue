<template>
  <div class="is-flex is-justify-content-space-between">
    <div class="is-flex is-flex-direction-column limit-width">
      <div v-if="collectionInfo?.currentOwner" class="is-flex mb-2">
        <div class="mr-2">Creator:</div>
        <nuxt-link
          class="is-size-6 break-word mr-2 has-text-link"
          :to="`/${chain}/u/${address}`">
          <span data-cy="identity-display"> {{ shortenedAddress }}</span>
        </nuxt-link>
      </div>
      <div>
        {{ collectionInfo?.meta.description }}
      </div>
    </div>
    <div>
      <div class="columns">
        <div class="column">
          <CollectionInfoLine title="Network" :value="chain" />
          <CollectionInfoLine
            title="Items"
            :value="representation(stats.collectionLength)" />
          <CollectionInfoLine
            title="Owners"
            :value="representation(stats.uniqueOwners)" />
        </div>
        <div class="column">
          <CollectionInfoLine title="Floor">
            <CommonTokenMoney
              :value="stats.collectionFloorPrice"
              inline
              :round="2" />
          </CollectionInfoLine>
          <CollectionInfoLine title="Best Offer">
            <CommonTokenMoney :value="stats.bestOffer" inline :round="2" />
          </CollectionInfoLine>
          <CollectionInfoLine title="Volume">
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
// TODO onChain identity
// TODO translation
// TODO which network colection belongs to?
import shortAddress from '@/utils/shortAddress'
import CollectionInfoLine from './collectionInfoLine.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
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
const shortenedAddress = computed(() => shortAddress(address.value))

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
</style>
