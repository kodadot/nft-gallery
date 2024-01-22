<template>
  <template v-if="isPhaseOpen">
    <MintPhaseHeader :title="title" is-phase-open />

    <MintPhaseBody
      :minted-count="mintedCount"
      :mint-count-available="mintCountAvailable"
      :max-count="maxCount"
      :state="state"
      :type="type"
      :has-phase-open="hasPhaseOpen"
      :minimum-funds="minimumFunds"
      :is-image-fetching="isImageFetching"
      :is-wallet-connecting="isWalletConnecting"
      :is-loading="isLoading"
      :mint-button="mintButton"
      :user-minted-nft-id="userMintedNftId"
      :holder-of-collection="holderOfCollection"
      :collection-id="collectionId"
      :available-to-mint="availableToMint"
      @mint="mint" />
  </template>

  <NeoCollapse v-else animation="slide" :open="isLastPhase && !hasPhaseOpen">
    <template #trigger="props">
      <MintPhaseHeader :title="title" :subtitle="subtitle">
        <NeoIcon :icon="props.open ? 'chevron-up' : 'chevron-down'" />
      </MintPhaseHeader>
    </template>

    <MintPhaseBody
      :minted-count="mintedCount"
      :mint-count-available="mintCountAvailable"
      :max-count="maxCount"
      :state="state"
      :type="type"
      :has-phase-open="hasPhaseOpen"
      :minimum-funds="minimumFunds"
      :is-image-fetching="isImageFetching"
      :is-wallet-connecting="isWalletConnecting"
      :is-loading="isLoading"
      :mint-button="mintButton"
      :user-minted-nft-id="userMintedNftId"
      :holder-of-collection="holderOfCollection"
      :collection-id="collectionId"
      :available-to-mint="availableToMint"
      @mint="mint" />
  </NeoCollapse>
</template>

<script setup lang="ts">
import { NeoCollapse, NeoIcon } from '@kodadot1/brick'
import MintPhaseHeader from './MintPhaseHeader.vue'
import {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintPhaseState,
  PhaseType,
} from '../../types'
import MintPhaseBody from './MintPhaseBody.vue'

const emit = defineEmits(['mint'])
const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    state: MintPhaseState
    isLastPhase: boolean
    hasPhaseOpen: boolean
    type: PhaseType

    mintedCount: number
    mintCountAvailable: boolean
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
const mint = () => emit('mint')
</script>
