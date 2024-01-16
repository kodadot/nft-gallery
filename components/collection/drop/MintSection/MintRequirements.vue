<template>
  <div>
    <div v-if="useList">
      <p class="text-k-grey mb-6">
        {{ $t('mint.unlockable.requirements') }}
      </p>

      <div>
        <div class="flex justify-between">
          <div class="flex gap-4 flex-col">
            <MintRequirementItem
              v-if="showHolderOfCollection && collection"
              :fulfilled="holderOfCollection.isHolder || false">
              <p class="capitalize">
                Holder of NFT from
                <nuxt-link
                  class="text-link-hover"
                  :to="`/${urlPrefix}/collection/${props.holderOfCollection.collectionId}`">
                  {{ collection?.name }}
                </nuxt-link>
                collection
              </p>
            </MintRequirementItem>
            <MintRequirementItem v-if="checkMinimumFunds" fulfilled>
              <p v-dompurify-html="minimumFunds.description" />
            </MintRequirementItem>
          </div>

          <div v-if="!isMintedOut" class="text-xs">
            <span class="text-k-grey capitalize mr-2">
              {{ $t('mint.unlockable.availableForMint') }}
            </span>
            <span>{{ available }}</span>

            <NeoTooltip
              multiline
              position="top"
              :auto-close="['outside', 'inside']"
              class="text-neutral-7">
              <NeoIcon
                icon="fa-info-circle"
                pack="fa-regular"
                class="ml-2 text-k-grey" />

              <template #content> </template>
            </NeoTooltip>
          </div>
        </div>

        <div
          class="flex items-center mt-2"
          :class="[isMintedOut ? 'justify-end' : 'justify-between']">
          <div
            v-if="!isMintedOut"
            class="border px-2 py-1 rounded-full h-fit w-fit capitalize text-xs flex"
            :class="[ready ? 'bg-k-green-accent' : 'bg-neutral-5']">
            <p>
              {{ mintLabel }}
            </p>

            <NeoIcon v-if="ready" class="ml-1" icon="check" />
          </div>

          <slot />
        </div>
      </div>
    </div>
    <div v-else class="flex justify-end flex-wrap">
      <div v-if="minimumFunds.amount" class="flex items-center">
        <NeoIcon icon="circle-info" class="mr-3" />
        <div
          v-dompurify-html="minimumFunds.description"
          class="minimum-funds-description" />
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import MintRequirementItem from './MintRequirementItem.vue'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'

enum MintRequirementType {
  MINIMUM_FUNDS = 'minimum_funds',
  HOLDER_OF_COLLECTION = 'holder_of_collection',
}

const props = withDefaults(
  defineProps<{
    holderOfCollection: {
      isHolder?: boolean
      collectionId?: string
    }
    minimumFunds: { amount: number; description: string }

    isMintedOut: boolean
    userMintedCount: number
    userMaxAvailableToMint: number

    requirements: MintRequirementType[]
  }>(),
  {
    requirements: () => [
      MintRequirementType.HOLDER_OF_COLLECTION,
      MintRequirementType.MINIMUM_FUNDS,
    ],
  },
)

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const { collection } = useCollectionMinimal({
  collectionId: computed(() => props.holderOfCollection.collectionId || ''),
})

const useList = computed(() => conditionsStates.value.length > 1)

const showHolderOfCollection = computed(
  () => !!props.holderOfCollection.collectionId,
)

const canMintAsManyNftsAsPossible = computed(
  () => props.userMaxAvailableToMint === Infinity,
)

const checkMinimumFunds = computed(() => Boolean(props.minimumFunds.amount))

const conditionsStates = computed(() => {
  const conditions: boolean[] = []

  if (props.requirements.includes(MintRequirementType.MINIMUM_FUNDS)) {
    conditions.push(checkMinimumFunds.value)
  }

  if (
    props.requirements.includes(MintRequirementType.HOLDER_OF_COLLECTION) &&
    showHolderOfCollection.value
  ) {
    conditions.push(Boolean(props.holderOfCollection.isHolder))
  }

  return conditions
})

const requirementsCompleted = computed(() =>
  conditionsStates.value.every(Boolean),
)

const ready = computed(() => requirementsCompleted.value)

const mintLabel = computed(() => {
  if (!accountId.value) {
    return $i18n.t('mint.unlockable.connectWallet')
  }

  const remaining = props.userMaxAvailableToMint - props.userMintedCount

  if (ready.value) {
    if (canMintAsManyNftsAsPossible.value) {
      return $i18n.t('mint.unlockable.readyToMint')
    }

    return `${$i18n.t('mint.unlockable.readyToMint')}: ${$i18n.t(
      'mint.unlockable.nftsRemaining',
      [remaining],
    )}`
  }

  return $i18n.t('mint.unlockable.readyToMint')
})

const available = computed(() =>
  canMintAsManyNftsAsPossible.value
    ? '∞'
    : `${props.userMintedCount}/${props.userMaxAvailableToMint}`,
)
</script>

<style scoped lang="scss">
.minimum-funds-description {
  max-width: 314px;
}
</style>
