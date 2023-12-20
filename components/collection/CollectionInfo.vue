<template>
  <div class="md:flex justify-between">
    <div class="max-w-screen-sm">
      <CollectionHeroButtons class="is-hidden-tablet" />
      <div v-if="address" class="flex mb-4">
        <div
          class="rounded-full w-full md:w-auto border border-k-shade flex justify-start px-3">
          <IdentityItem
            :label="$t('activity.creator')"
            :prefix="urlPrefix"
            :account="address"
            class="identity-name-font-weight-regular"
            data-testid="collection-creator-address" />
        </div>
      </div>

      <div class="mb-4">
        <span v-if="recipient" class="inline">
          <span class="capitalize text-neutral-7">{{ $t('royalty') }}</span>
          &nbsp;{{ royalty }}%
          <NeoTooltip
            multiline
            position="bottom"
            :auto-close="['outside', 'inside']"
            class="text-neutral-7">
            <NeoIcon class="icon" icon="info-circle" />

            <template #content>
              Recipient Address:
              <nuxt-link
                :to="`/${urlPrefix}/u/${recipient}`"
                class="has-text-link">
                <IdentityIndex
                  ref="identity"
                  :address="recipient"
                  show-clipboard />
              </nuxt-link>
            </template>
          </NeoTooltip>
          <span class="text-neutral-5 mx-2">•</span>
        </span>
        <span>
          <span class="capitalize text-neutral-7">{{ $t('created') }}</span
          >&nbsp;{{ new Date(createdAt).toLocaleDateString() }}
          <span class="text-neutral-5 mx-2">•</span>
        </span>
        <span>
          <span class="capitalize text-neutral-7">{{
            $t('activity.network')
          }}</span
          >&nbsp;{{ chain }}
          <span class="text-neutral-5 mx-2">•</span>
        </span>
        <span>
          <span class="capitalize text-neutral-7">{{ $t('supply') }}</span
          >&nbsp;{{ stats.maxSupply || $t('helper.unlimited') }}
        </span>
      </div>
      <div class="break-words">
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

    <div class="w-full lg:w-72 pt-4">
      <CollectionInfoLine :title="$t('activity.floor')">
        <CommonTokenMoney
          :value="stats.collectionFloorPrice"
          inline
          :round="2" />
      </CollectionInfoLine>
      <CollectionInfoLine :title="$t('activity.volume')">
        <CommonTokenMoney
          :value="stats.collectionTradedVolumeNumber"
          inline
          :round="2" />
      </CollectionInfoLine>
      <CollectionInfoLine
        :title="$t('series.owners')"
        :value="stats.uniqueOwners" />
      <CollectionInfoLine title="Listed/Supply">
        <span class="text-xs text-neutral-7 leading-6 font-normal mr-2"
          >{{
            Math.floor(
              (Number(stats.listedCount) / Number(stats.collectionLength)) *
                100,
            )
          }}%</span
        >
        {{ stats.listedCount }} /
        {{ stats.collectionLength }}
      </CollectionInfoLine>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoTooltip } from '@kodadot1/brick'

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
      ?.text,
)
const address = computed(() => collectionInfo.value?.currentOwner)
const recipient = computed(() => collectionInfo.value?.recipient)
const royalty = computed(() => collectionInfo.value?.royalty)
const createdAt = computed(() => collectionInfo.value?.createdAt)
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
