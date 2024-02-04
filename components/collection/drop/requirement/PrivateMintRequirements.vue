<template>
  <div>
    <div class="flex justify-between">
      <div class="flex gap-4 flex-col w-full">
        <MintRequirementItem
          v-if="showHolderOfCollection && collection"
          :fulfilled="fulfillsHolderOfCollection"
          :loading="holderOfCollection.isLoading">
          <div class="flex justify-between items-center w-full">
            <p class="capitalize">
              Holder of NFT from
              <nuxt-link
                class="has-text-link"
                :to="`/${urlPrefix}/collection/${props.holderOfCollection.id}`">
                {{ collection?.name }}
              </nuxt-link>
              collection
            </p>
          </div>
        </MintRequirementItem>
        <CollectionDropRequirementItem
          :fulfilled="fulfillsMinimumFunds"
          :loading="minimumFunds.isLoading">
          <p v-dompurify-html="minimumFunds.description" />
        </CollectionDropRequirementItem>
      </div>
    </div>

    <div class="flex items-center text-xs pl-[36px] mt-4">
      <span class="text-k-grey capitalize mr-2">
        {{ $t('mint.unlockable.availableForMint') }}
      </span>
      <span
        >{{ props.holderOfCollection.amount?.available }}/{{
          props.holderOfCollection.amount?.total
        }}</span
      >

      <NeoTooltip
        position="top"
        multiline
        multiline-width="15rem"
        root-class="ml-2"
        content-class="capitalize">
        <NeoIcon icon="fa-info-circle" pack="fa-regular" class="text-k-grey" />

        <template #content>
          <p
            v-dompurify-html="
              $t('mint.unlockable.holderOfWarning1', [collection?.name])
            "
            class="mb-3" />
          <p v-dompurify-html="$t('mint.unlockable.holderOfWarning2')" />
        </template>
      </NeoTooltip>
    </div>

    <div
      class="flex items-start md:items-center mt-5 flex-col md:flex-row"
      :class="[isMintedOut ? 'justify-end' : 'justify-between']">
      <div
        v-if="!isMintedOut"
        class="border px-2 py-1 rounded-full h-fit w-fit capitalize text-xs flex"
        :class="[
          readyToMint ? 'bg-k-green-accent' : 'bg-neutral-5 dark:bg-neutral-9',
        ]">
        <p>
          {{ mintLabel }}
        </p>

        <NeoIcon v-if="readyToMint" class="ml-1" icon="check" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MintRequirementItem from './Item.vue'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'
import type { HolderOfCollectionProp, MinimumFundsProp } from '../types'

const props = defineProps<{
  holderOfCollection: HolderOfCollectionProp
  minimumFunds: MinimumFundsProp
  isMintedOut: boolean
}>()

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const { collection } = useCollectionMinimal({
  collectionId: computed(() => props.holderOfCollection.id || ''),
})

const showHolderOfCollection = computed(() => !!props.holderOfCollection.id)

const fulfillsHolderOfCollection = computed(
  () =>
    Boolean(props.holderOfCollection.isHolder) &&
    props.holderOfCollection.hasAvailable,
)

const fulfillsMinimumFunds = computed(
  () => Boolean(props.minimumFunds.amount) && props.minimumFunds.hasAmount,
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
