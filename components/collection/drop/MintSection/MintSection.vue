<template>
  <div>
    <div v-for="(phase, index) in phases" :key="phase.type">
      <MintPhase
        :title="phase.name"
        :subtitle="phase.subtitle"
        :max-count="phase.count.max"
        :minted-count="phase.count.minted"
        :state="phase.state"
        :is-last-phase="phase.isLast"
        :type="phase.type"
        :has-phase-open="hasPhaseOpen"
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
        @mint="() => $emit('mint', phase.type)" />

      <hr v-if="phases.length - 1 !== index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HolderOfCollectionProp } from '../HolderOfGenerative.vue'
import MintPhase from './MintPhase/MintPhase.vue'
import {
  MinimumFundsProp,
  MintButtonProp,
  MintPhaseState,
  MintPhase as MintPhaseType,
} from '../types'

defineEmits(['mint'])
const props = withDefaults(
  defineProps<{
    mintButton: MintButtonProp
    minimumFunds: MinimumFundsProp
    mintCountAvailable: boolean
    disabledByBackend: number
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    userMintedNftId?: string
    collectionId: string
    availableToMint?: number
    mintPhases?: MintPhaseType[]
    holderOfCollection?: HolderOfCollectionProp
  }>(),
  {
    userMintedNftId: undefined,
    mintPhases: () => [],
  },
)

const { $i18n } = useNuxtApp()

const hasPhaseOpen = computed(() =>
  phases.value.map((phase) => phase.state).includes(MintPhaseState.OPEN),
)

const phases = computed(() =>
  props.mintPhases.map((phase, index) => {
    const prevMintPhase = props.mintPhases[index - 1] || null

    const title = phase.name || $i18n.t('mint.unlockable.phase')
    let subtitle = ''

    let state = MintPhaseState.OPEN

    if (prevMintPhase && !prevMintPhase.mintedOut) {
      state = MintPhaseState.WAITING
      subtitle = `${$i18n.t('After')} ${prevMintPhase.name}`
    }

    if (phase.mintedOut || props.disabledByBackend) {
      state = MintPhaseState.CLOSED
      subtitle = $i18n.t('closed')
    }

    return {
      ...phase,
      title: title,
      subtitle: subtitle,
      state: state,
      isLast: index + 1 === props.mintPhases.length,
    }
  }),
)
</script>
