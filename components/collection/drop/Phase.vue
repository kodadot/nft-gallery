<template>
  <div>
    <div class="flex justify-between items-center mt-24 md:mt-0 mb-5">
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

    <p v-if="showHolderOfRequirements" class="text-k-grey mb-5">
      {{ $t('mint.unlockable.requirements') }}
    </p>

    <CollectionDropRequirementPrivateMintRequirements
      v-if="showHolderOfRequirements && holderOfCollection"
      :holder-of-collection="holderOfCollection"
      :minimum-funds="minimumFunds"
      :is-minted-out="isMintedOut" />

    <!-- if there is location on the campaign -->
    <CollectionDropRequirementItem
      v-if="drop.location"
      :fulfilled="Boolean(drop.userAccess)">
      <p class="capitalize">
        Location Verification: You are
        <span v-if="!Boolean(drop.userAccess)" class="font-bold">not</span> in
        <span class="font-bold">{{ drop.location }}</span>
      </p>
    </CollectionDropRequirementItem>
  </div>
</template>

<script setup lang="ts">
import { DropItem } from '@/params/types'
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
  drop: DropItem
}>()

const { $i18n } = useNuxtApp()
const showHolderOfRequirements = computed(
  () =>
    (showHolderOfCollection.value && props.holderOfCollection) ||
    props.drop.location,
)
const isMintedOut = computed(() => !props.mintCountAvailable)
const showHolderOfCollection = computed(() => !!props.holderOfCollection?.id)

const currentPhaseTitle = computed(() =>
  showHolderOfCollection.value
    ? $i18n.t('drops.phases.private')
    : $i18n.t('drops.phases.public'),
)
</script>
