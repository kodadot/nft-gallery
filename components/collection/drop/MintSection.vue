<template>
  <div>
    <div>
      <div class="flex justify-between items-center mb-5">
        <div class="has-text-weight-bold is-size-5">
          {{ $t('mint.unlockable.phase') }}
        </div>
        <div v-if="mintCountAvailable" class="flex items-center">
          <img src="/unlockable-pulse.svg" alt="open" />
          {{ $t('mint.unlockable.open') }}
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div>{{ mintedPercent }} %</div>
        <div class="has-text-weight-bold">
          {{ mintedCount }} / {{ maxCount }}
          {{ $t('statsOverview.minted') }}
        </div>
      </div>
    </div>

    <div class="my-5">
      <UnlockableSlider :value="mintedCount / maxCount" />
    </div>

    <div class="my-5">
      <div v-if="userMintedNftId" class="flex justify-end items-center">
        <div class="mr-2">
          {{ $t('mint.unlockable.nftAlreadyMinted') }}
        </div>
        <NeoIcon
          icon="circle-check has-text-success"
          pack="fass"
          class="mr-4" />
        <NeoButton
          class="my-2 mint-button"
          :tag="NuxtLink"
          :label="$t('mint.unlockable.seeYourNft')"
          :to="`/${urlPrefix}/gallery/${userMintedNftId}`" />
      </div>

      <div
        v-else-if="showHolderOfCollection"
        class="columns holder-of-collection">
        <div class="column">
          <CollectionDropHolderOfCollection
            class="mt-4 mb-5"
            :is-holder="holderOfCollection.isHolderOfTargetCollection"
            :collection-id="holderOfCollection.id" />

          <div v-if="minimumFunds.amount" class="flex items-center mr-5">
            <NeoIcon icon="circle-info" class="mr-3" />
            <div
              v-dompurify-html="minimumFunds.description"
              class="minimum-funds-description" />
          </div>
        </div>

        <div class="column has-text-right">
          <NeoButton
            ref="root"
            class="my-2 mint-button"
            variant="k-accent"
            :loading="loading"
            :disabled="mintButton.disabled"
            :loading-with-label="isWalletConnecting"
            :label="mintButton.label"
            @click="emit('mint')" />
        </div>
      </div>

      <div v-else class="flex justify-end">
        <div v-if="minimumFunds.amount" class="flex items-center mr-5">
          <NeoIcon icon="circle-info" class="mr-3" />
          <div
            v-dompurify-html="minimumFunds.description"
            class="minimum-funds-description" />
        </div>

        <NeoButton
          ref="root"
          class="my-2 mint-button"
          variant="k-accent"
          :loading="loading"
          :disabled="mintButton.disabled"
          :loading-with-label="isWalletConnecting"
          :label="mintButton.label"
          @click="emit('mint')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import { NeoButton, NeoIcon } from '@kodadot1/brick'

const NuxtLink = resolveComponent('NuxtLink')

const props = withDefaults(
  defineProps<{
    mintedCount: number
    mintCountAvailable: boolean
    maxCount: number
    minimumFunds: { amount: bigint; description: string }
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    mintButton: { label: string; disabled: boolean }
    userMintedNftId?: string
    holderOfCollection?: { id?: string; isHolderOfTargetCollection?: boolean }
  }>(),
  {
    userMintedNftId: undefined,
    holderOfCollection: () => ({ id: '', isHolderOfTargetCollection: false }),
  },
)

const emit = defineEmits(['mint'])

const { urlPrefix } = usePrefix()

const loading = computed(
  () => props.isImageFetching || props.isWalletConnecting || props.isLoading,
)

const mintedPercent = computed(() => {
  const percent = (props.mintedCount / props.maxCount) * 100
  return Math.round(percent)
})

const showHolderOfCollection = computed(() => !!props.holderOfCollection.id)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.minimum-funds-description {
  max-width: 314px;
}

.mint-button {
  width: 14rem;
  height: 3.5rem;
}

.holder-of-collection {
  @include mobile {
    .mint-button {
      width: 100%;
    }
  }
}
</style>
