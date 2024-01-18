<template>
  <div>
    <div v-for="phase in phases" :key="phase.type">
      <MintPhase
        :title="phase.name"
        :subtitle="$t('mint.unlockable.phase')"
        :max-count="phase.count.max"
        :minted-count="phase.count.minted"
        :mint-count-available="mintCountAvailable"
        :disabled-by-backend="disabledByBackend"
        :minimum-funds="minimumFunds"
        :is-image-fetching="isImageFetching"
        :is-wallet-connecting="isWalletConnecting"
        :is-loading="isLoading"
        :mint-button="mintButton"
        :user-minted-nft-id="userMintedNftId"
        :holder-of-collection="holderOfCollection"
        :collection-id="collectionId"
        :available-to-mint="availableToMint"
        :is-phase-open="phase.isPhaseOpen" />

      <hr />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HolderOfCollectionProp } from '../HolderOfGenerative.vue'
import MintPhase from './MintPhase/MintPhase.vue'
import { MinimumFundsProp, MintPhase as MintPhaseType } from '../types'

const props = withDefaults(
  defineProps<{
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
    mintPhases?: MintPhaseType[]
  }>(),
  {
    userMintedNftId: undefined,
    mintPhases: () => [],
  },
)

const { $i18n } = useNuxtApp()

const phases = computed(() =>
  props.mintPhases.map((phase) => {
    const title = phase.name || $i18n.t('mint.unlockable.phase')
    const isPhaseOpen = props.mintCountAvailable && !props.disabledByBackend

    return {
      ...phase,
      title: title,
      isPhaseOpen: phase.disabled ? false : isPhaseOpen,
    }
  }),
)
</script>
