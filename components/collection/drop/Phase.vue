<template>
  <div>
    <div class="flex justify-between items-center mb-5">
      <div class="font-bold is-size-5">
        {{ currentPhaseTitle }}
      </div>
      <div
        v-if="mintCountAvailable && !disabledByBackend"
        class="flex items-center">
        <img
          v-if="svgAnimationImageMounted"
          src="/unlockable-pulse.svg"
          alt="open-image"
          width="32"
          height="32" />
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
const svgAnimationImageMounted = ref(false) // hack fix animation on svg

onMounted(() => {
  setTimeout(() => {
    svgAnimationImageMounted.value = true
  }, 500)
})
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
