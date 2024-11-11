<template>
  <div class="border bg-background-color shadow-primary w-full h-min md:w-[380px] relative">
    <div class="px-6 py-4 flex justify-between border-b items-center">
      <div class="text-base font-bold line-height">
        {{ title }}
      </div>
    </div>

    <div class="!px-6 !pb-6 !pt-4 min-h-[40vh] overflow-y-auto">
      <div class="flex justify-between items-center">
        <span>
          {{ count }} {{ $t('items') }}
        </span>

        <a
          v-if="count"
          @click="clearAll"
        >
          {{ $t('shoppingCart.clearAll') }}
        </a>
      </div>

      <hr
        v-if="count"
        class="!my-6"
      >

      <div
        ref="itemsContainer"
        class="flex flex-col gap-3 max-h-[300px] overflow-y-auto"
      >
        <div
          v-for="nft in stepItems"
          :key="nft.id"
          class="flex justify-between items-center"
        >
          <div
            class="flex gap-4 items-center"
          >
            <BaseMediaItem
              class="border border-k-shade image is-32x32"
              :alt="nft.name"
              :src="sanitizeIpfsUrl(nft.meta.image)"
              preview
              is-detail
            />

            <span>
              {{ nft.name }}
            </span>
          </div>

          <NeoButton
            size="small"
            variant="icon"
            icon="xmark"
            @click="() => swapStore.removeStepItem(nft.id)"
          />
        </div>

        <div
          v-if="stepHasSurcharge"
          class="flex justify-between items-center"
        >
          <div
            class="flex gap-4 items-center"
          >
            <BaseMediaItem
              class="image is-32x32"
              :src="getChainIcon(urlPrefix) || ''"
            />

            <Money
              :value="swap.surcharge?.amount"
              inline
            />
          </div>

          <NeoButton
            size="small"
            variant="icon"
            icon="xmark"
            @click="swap.surcharge = undefined"
          />
        </div>
      </div>

      <hr class="!my-6">

      <div class="flex flex-col gap-4">
        <div class="font-bold flex items-center gap-2">
          <span> {{ surchargeTitle }}  </span>
          <span class="text-k-grey text-xs">({{ $t('massmint.optional') }})</span>
        </div>

        <div class="flex items-center gap-2">
          <ListingCartPriceInput
            v-model="amount"
            class="w-[200px]"
            :placeholder="$t('amount')"
            :disabled="surchargeDisabled"
            full-width
          />

          <NeoButton
            class="h-10 w-[120px]"
            icon-pack="fas"
            icon-left="plus"
            no-shadow
            :label="$t('add')"
            :disabled="surchargeDisabled || !amount"
            @click="addSurcharge"
          />
        </div>
      </div>
    </div>

    <div class="py-6 px-6">
      <div class="flex gap-4">
        <NeoButton
          size="large"
          label="Back"
          variant="text"
          no-shadow
          expanded
          @click="onBack"
        />
        <NeoButton
          size="large"
          label="Next"
          variant="primary"
          :disabled
          no-shadow
          expanded
          @click="onNext"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { type SwapSurchargeDirection } from '@/composables/transaction/types'

type StepDetails = {
  title: string
  surchargeTitle: string
  nextRouteName: string
  backRouteName: string
  surchargeDirection: SwapSurchargeDirection
}

const stepDetailsMap: Partial<Record<SwapStep, StepDetails>> = {
  [SwapStep.DESIRED]: {
    title: 'swap.yourSwapList',
    surchargeTitle: 'swap.requestToken',
    nextRouteName: getSwapStepRouteName(SwapStep.OFFERED),
    backRouteName: getSwapStepRouteName(SwapStep.COUNTERPARTY),
    surchargeDirection: 'Receive',
  },
  [SwapStep.OFFERED]: {
    title: 'swap.yourOffer',
    surchargeTitle: 'swap.addToken',
    nextRouteName: getSwapStepRouteName(SwapStep.REVIEW),
    backRouteName: getSwapStepRouteName(SwapStep.DESIRED),
    surchargeDirection: 'Send',
  },
}

const swapStore = useAtomicSwapsStore()
const { swap, step, stepItems } = storeToRefs(swapStore)
const { $i18n } = useNuxtApp()
const { accountId } = useAuth()
const { decimals } = useChain()
const { urlPrefix } = usePrefix()
const { getChainIcon } = useIcon()

const amount = ref()
const itemsContainer = ref()

const surchargeDisabled = computed(() => Boolean(swap.value.surcharge))
const stepDetails = computed(() => stepDetailsMap[step.value] as StepDetails)
const title = computed(() => $i18n.t(stepDetails.value.title))
const surchargeTitle = computed(() => $i18n.t(stepDetails.value.surchargeTitle))
const stepHasSurcharge = computed(() => swap.value.surcharge?.direction === stepDetails.value.surchargeDirection)
const count = computed(() => stepItems.value.length + (stepHasSurcharge.value ? 1 : 0))
const disabled = computed(() => !stepItems.value.length || !accountId.value)

const goTo = (name: string) => {
  return navigateTo({ name, params: { id: swap.value.counterparty }, query: { swapId: swap.value.id } })
}

const onNext = async () => {
  await goTo(stepDetails.value.nextRouteName)
}

const onBack = async () => {
  await goTo(stepDetails.value.backRouteName)
}

const clearAll = () => {
  swapStore.updateStepItems([])
  swap.value.surcharge = undefined
}

const addSurcharge = () => {
  swap.value.surcharge = { amount: String(Number(amount.value) * Math.pow(10, decimals.value)), direction: stepDetails.value.surchargeDirection }
  amount.value = ''
}

watch(() => stepItems.value.length, () => {
  nextTick().then(() => {
    // scroll to bottom
    itemsContainer.value.scrollTo({
      top: itemsContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  })
})
</script>
