<template>
  <div>
    <div class="flex justify-between">
      <div class="flex gap-4 flex-col w-full">
        <CollectionDropRequirementItem
          :fulfilled="fulfillsMinimumFunds"
          :loading="minimumFundsAttrs.isLoading"
        >
          <p v-dompurify-html="minimumFundsAttrs.description" />
        </CollectionDropRequirementItem>
        <CollectionDropRequirementItem
          v-if="showHolderOfCollection && collection"
          :fulfilled="fulfillsHolderOfCollection"
          :loading="holderOfCollection.isLoading"
        >
          <i18n-t
            keypath="drops.holderOfCollection"
            class="capitalize"
            tag="p"
          >
            <template #name>
              <CollectionDetailsPopover :collection="collection">
                <template #content>
                  <nuxt-link
                    :to="`/${urlPrefix}/collection/${holderOfCollection.id}`"
                    class="text-k-blue hover:text-k-blue-hover"
                  >
                    {{ collection?.name }}
                  </nuxt-link>
                </template>
              </CollectionDetailsPopover>
            </template>
          </i18n-t>
        </CollectionDropRequirementItem>
      </div>
    </div>

    <div class="flex items-center text-xs pl-[36px] mt-4">
      <span class="text-k-grey capitalize mr-2">
        {{ $t('mint.unlockable.availableForMint') }}
      </span>
      <span>{{ props.holderOfCollection.amount?.available }}/{{
        props.holderOfCollection.amount?.total
      }}</span>

      <NeoTooltip
        position="top"
        multiline
        multiline-width="15rem"
        root-class="ml-2"
        content-class="capitalize"
      >
        <KIcon
          name="i-mdi:information-slab-circle"
          class="text-k-grey"
        />

        <template #content>
          <p
            v-dompurify-html="
              $t('mint.unlockable.holderOfWarning1', [collection?.name])
            "
            class="mb-3"
          />
          <p v-dompurify-html="$t('mint.unlockable.holderOfWarning2')" />
        </template>
      </NeoTooltip>
    </div>

    <div
      class="flex items-start md:items-center mt-5 flex-col md:flex-row"
      :class="[isMintedOut ? 'justify-end' : 'justify-between']"
    >
      <div
        v-if="!isMintedOut"
        class="border px-2 py-1 rounded-full h-fit w-fit capitalize text-xs flex"
        :class="[
          readyToMint ? 'bg-k-green-accent' : 'bg-neutral-5 dark:bg-neutral-9',
        ]"
      >
        <p>
          {{ mintLabel }}
        </p>

        <KIcon
          v-if="readyToMint"
          class="ml-1"
          name="i-mdi:check"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoTooltip } from '@kodadot1/brick'
import type { HolderOfCollection } from '../types'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import { useDrop, useDropMinimumFunds } from '@/components/drops/useDrops'

const props = defineProps<{
  holderOfCollection: HolderOfCollection
  isMintedOut: boolean
}>()

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { chainName } = useDrop()

const { collection } = useCollectionMinimal({
  collectionId: computed(() => props.holderOfCollection.id || ''),
})

const showHolderOfCollection = computed(() => !!props.holderOfCollection.id)

const { hasCurrentChainBalance } = useMultipleBalance()
const { hasMinimumFunds, formattedMinimumFunds, minimumFunds }
  = useDropMinimumFunds()

const fulfillsHolderOfCollection = computed(
  () =>
    Boolean(props.holderOfCollection.isHolder)
    && props.holderOfCollection.hasAvailable,
)

const minimumFundsAttrs = computed(() => ({
  amount: minimumFunds.value,
  description: $i18n.t('drops.requirements.minimumFunds', [
    formattedMinimumFunds.value,
    chainName.value,
  ]),
  hasAmount: hasMinimumFunds.value,
  isLoading: !hasCurrentChainBalance.value,
}))

const fulfillsMinimumFunds = computed(
  () =>
    Boolean(minimumFundsAttrs.value.amount)
    && minimumFundsAttrs.value.hasAmount,
)

const readyToMint = computed(
  () => fulfillsHolderOfCollection.value && fulfillsMinimumFunds.value,
)

const availableForMint = computed(
  () => props.holderOfCollection.amount?.available || 0,
)

const mintLabel = computed(() => {
  if (!accountId.value) {
    return $i18n.t('mint.unlockable.connectWallet')
  }

  if (readyToMint.value) {
    return $i18n.t('mint.unlockable.readyToMint', [availableForMint.value])
  }

  return $i18n.t('mint.unlockable.requirementsNotMet')
})
</script>
