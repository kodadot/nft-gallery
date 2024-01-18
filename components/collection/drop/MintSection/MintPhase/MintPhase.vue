<template>
  <template v-if="isPhaseOpen">
    <MintPhaseHeader :title="title" is-phase-open />

    <MintPhaseBody
      :minted-count="mintedCount"
      :mint-count-available="mintCountAvailable"
      :disabled-by-backend="disabledByBackend"
      :max-count="maxCount"
      :minimum-funds="minimumFunds"
      :is-image-fetching="isImageFetching"
      :is-wallet-connecting="isWalletConnecting"
      :is-loading="isLoading"
      :mint-button="mintButton"
      :user-minted-nft-id="userMintedNftId"
      :holder-of-collection="holderOfCollection"
      :collection-id="collectionId"
      :available-to-mint="availableToMint" />
  </template>

  <NeoCollapse v-else animation="slide" :open="isLastPhase && !hasOpen">
    <template #trigger="props">
      <MintPhaseHeader :title="title" :subtitle="subtitle">
        <NeoIcon :icon="props.open ? 'chevron-up' : 'chevron-down'" />
      </MintPhaseHeader>
    </template>

    <MintPhaseBody
      :minted-count="mintedCount"
      :mint-count-available="mintCountAvailable"
      :disabled-by-backend="disabledByBackend"
      :max-count="maxCount"
      :minimum-funds="minimumFunds"
      :is-image-fetching="isImageFetching"
      :is-wallet-connecting="isWalletConnecting"
      :is-loading="isLoading"
      :mint-button="mintButton"
      :user-minted-nft-id="userMintedNftId"
      :holder-of-collection="holderOfCollection"
      :collection-id="collectionId"
      :available-to-mint="availableToMint" />
  </NeoCollapse>
</template>

<script setup lang="ts">
import { NeoCollapse, NeoIcon } from '@kodadot1/brick'
import type { HolderOfCollectionProp } from '../../HolderOfGenerative.vue'
import MintPhaseHeader from './MintPhaseHeader.vue'
import { MinimumFundsProp, MintPhaseState } from '../../types'
import MintPhaseBody from './MintPhaseBody.vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    state: MintPhaseState
    isLastPhase: boolean
    hasOpen: boolean

    mintedCount: number
    mintCountAvailable: boolean
    disabledByBackend: number
    maxCount: number
    minimumFunds: MinimumFundsProp
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    mintButton: { label: string; disabled: boolean }
    userMintedNftId?: string
    holderOfCollection?: HolderOfCollectionProp
    collectionId: string
    availableToMint?: number
  }>(),
  {
    userMintedNftId: undefined,
  },
)

const isPhaseOpen = computed(() => props.state === MintPhaseState.OPEN)
</script>
