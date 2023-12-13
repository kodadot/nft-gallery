<template>
  <div>
    <div>
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-5">
        <div class="has-text-weight-bold is-size-5">
          {{ $t('mint.unlockable.phase') }}
        </div>
        <div v-if="mintCountAvailable" class="is-flex is-align-items-center">
          <img src="/unlockable-pulse.svg" alt="open" />
          {{ $t('mint.unlockable.open') }}
        </div>
      </div>
      <div
        class="is-flex is-justify-content-space-between is-align-items-center">
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
      <div class="is-flex is-justify-content-flex-end is-align-items-center">
        <div v-if="hasUserMinted" class="is-flex is-align-items-center">
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
            :to="`/${urlPrefix}/gallery/${hasUserMinted}`" />
        </div>

        <div v-else class="is-flex">
          <div v-if="minimumFunds" class="is-flex is-align-items-center mr-5">
            <NeoIcon icon="circle-info" class="mr-3" />
            <div
              v-dompurify-html="
                $t('mint.unlockable.minimumFundsDescription', [
                  `${minimumFunds} ${token}`,
                ])
              "
              class="minimum-funds-description" />
          </div>
          <NeoButton
            ref="root"
            class="my-2 mint-button"
            variant="k-accent"
            :loading="isImageFetching || isWalletConnecting"
            :disabled="mintButtonDisabled"
            :loading-with-label="isWalletConnecting"
            :label="
              $t(
                isWalletConnecting
                  ? 'shoppingCart.wallet'
                  : 'mint.unlockable.claimNftNow',
              )
            "
            @click="emit('mint1')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import { NeoButton, NeoIcon } from '@kodadot1/brick'

const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  mintedCount: number
  maxCount: number
  token: string
  minimumFunds: number
  isImageFetching: boolean
  isWalletConnecting: boolean
  disabled: boolean
  hasUserMinted: string
}>()

const emit = defineEmits(['mint'])

const { urlPrefix } = usePrefix()

const mintedPercent = computed(() => {
  const percent = (props.mintedCount / props.maxCount) * 100
  return Math.round(percent)
})

const mintCountAvailable = computed(() => props.mintedCount < props.maxCount)

const mintButtonDisabled = computed(
  () => props.disabled || !mintCountAvailable.value,
)
</script>

<style scoped lang="scss">
.mint-button {
  width: 14rem;
  height: 3.5rem;
}
</style>
