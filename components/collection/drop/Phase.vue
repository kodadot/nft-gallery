<template>
  <div>
    <div class="flex justify-between items-center mt-20 md:mt-0 mb-5">
      <div class="font-bold is-size-5">
        {{ currentPhaseTitle }}
      </div>
      <div
        v-if="mintCountAvailable && !disabledByBackend"
        class="flex items-center">
        <span class="relative flex h-3 w-3 mr-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-k-primary opacity-75"></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-k-primary"></span>
        </span>
        {{ $t('mint.unlockable.open') }}
      </div>
    </div>

    <p class="text-k-grey mb-5">
      {{ $t('mint.unlockable.requirements') }}
    </p>

    <CollectionDropRequirementPrivateMintRequirements
      v-if="showHolderOfCollection && holderOfCollection"
      :holder-of-collection="holderOfCollection"
      :minimum-funds="minimumFunds"
      :is-minted-out="isMintedOut" />

    <CollectionDropRequirementItem
      v-else
      :fulfilled="fulfillsMinimumFunds"
      :loading="minimumFunds.isLoading">
      <p v-dompurify-html="minimumFunds.description" />
    </CollectionDropRequirementItem>
  </div>
</template>

<script setup lang="ts">
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from './types'

const props = defineProps<{
  mintCountAvailable: boolean
  disabledByBackend: number
  minimumFunds: MinimumFundsProp
  mintButton: MintButtonProp
  holderOfCollection?: HolderOfCollectionProp
}>()

const { $i18n } = useNuxtApp()

const isMintedOut = computed(() => !props.mintCountAvailable)
const showHolderOfCollection = computed(() => !!props.holderOfCollection?.id)
const fulfillsMinimumFunds = computed(
  () => Boolean(props.minimumFunds.amount) && props.minimumFunds.hasAmount,
)

const currentPhaseTitle = computed(() =>
  showHolderOfCollection.value
    ? $i18n.t('drops.phases.private')
    : $i18n.t('drops.phases.public'),
)
</script>
