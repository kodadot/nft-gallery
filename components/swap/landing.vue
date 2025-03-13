<template>
  <div class="max-w-[490px] mx-auto">
    <div class="flex flex-col h-full space-y-10 pt-8">
      <div>
        <div class="flex items-center">
          <img
            class="-ml-8"
            src="~/assets/svg/swap/arrows.svg"
            alt="Swap NFTs"
          >
          <h1 class="title">
            {{ $t('swap.landingTitle') }}
          </h1>
        </div>
        <p class="mb-2">
          {{ $t('swap.landingSubtitle') }}
        </p>
      </div>

      <div>
        <h2 class="mb-2 font-bold text-text-color capitalize">
          {{ $t('swap.connectTrader') }}
        </h2>
        <p>
          {{ $t('swap.connectTraderInfo') }}
        </p>
      </div>

      <div class="flex flex-col gap-7">
        <form @submit.prevent="handleSubmit">
          <AddressInput
            v-model="traderAddress"
            :is-invalid="isYourAddress"
            :icon-right="!isTraderAddressValid || isYourAddress ? 'close' : undefined"
            placeholder="Enter wallet address"
            with-address-check
            @check="handleAddressCheck"
          />

          <NeoButton
            type="submit"
            :label="label"
            size="large"
            class="text-base mt-5 capitalize"
            :class="{
              'mb-5': !showIncomingTrades,
            }"
            expanded
            :disabled="disabled"
            native-type="submit"
            variant="primary"
          />
        </form>

        <div
          v-if="showIncomingTrades"
          class="flex justify-center"
        >
          <NeoSkeleton
            v-if="isLoadingIncomingTrades"
            no-margin
            class="!w-[226px]"
            width="226px"
            border-radius="20px"
            height="40px"
          />

          <NeoButton
            v-else
            :tag="NuxtLink"
            :to="`/${urlPrefix}/u/${accountId}?tab=swaps`"
            variant="outlined-rounded"
          >
            {{ $t('swap.yourSwapOffers') }}

            <span class="text-k-grey">
              ({{ swapOffersCount }})
            </span>

            <NeoIcon
              class="ml-2"
              icon="arrow-right"
            />
          </NeoButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon, NeoSkeleton } from '@kodadot1/brick'

const NuxtLink = resolveComponent('NuxtLink')

const { isCurrentAccount, accountId } = useAuth()
const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const traderAddress = ref('')
const isTraderAddressValid = ref(false)
const isYourAddress = ref(false)
const isLoadingSwapOffersCount = ref(true)
const swapOffersCount = ref<number>()
const swapOfferSubscription = ref(() => {})

const { data: ownedCollections, isPending: isLoadingOwnedCollections } = useOwnedCollections(accountId)

const isLoadingIncomingTrades = computed(() => isLoadingSwapOffersCount.value || isLoadingOwnedCollections.value)
const showIncomingTrades = computed(() => Boolean(accountId.value) && (isLoadingIncomingTrades.value || Boolean(swapOffersCount.value)))

const isAddressEmpty = computed(() => !traderAddress.value)
const disabled = computed(() => isAddressEmpty.value || isYourAddress.value || !isTraderAddressValid.value)

const label = computed(() => {
  if (isYourAddress.value) {
    return $i18n.t('swap.cantSwapWithYourself')
  }

  if (isAddressEmpty.value) {
    return $i18n.t('transaction.inputAddressFirst')
  }

  if (!isTraderAddressValid.value) {
    return $i18n.t('transaction.addressIncorrect')
  }

  return $i18n.t('swap.beginSwap')
})

const handleAddressCheck = (isValid: boolean) => {
  isTraderAddressValid.value = isValid
  isYourAddress.value = isTraderAddressValid.value ? isCurrentAccount(traderAddress.value) : false
}

const handleSubmit = async () => {
  await navigateTo({ name: 'prefix-swap-id', params: { id: traderAddress.value } })
}

watch([ownedCollections, accountId], ([ownedCollections, account]) => {
  swapOffersCount.value = undefined

  if (!account) {
    return
  }

  if (ownedCollections !== undefined && ownedCollections.length) {
    isLoadingSwapOffersCount.value = true
    swapOfferSubscription.value = useSubscriptionGraphql<{ swapsConnection: { totalCount: number } }>({
      query: `swapsConnection(
      orderBy: blockNumber_DESC,
      where: {
        OR: [
          ${buildIncomingTradesQuery(accountId.value, ownedCollections.map(({ id }) => id) || [], { stringify: true })},
          { caller_eq: "${accountId.value}" , status_in: [ACTIVE, EXPIRED ]}
        ]
      }) {
      totalCount
      }`,
      onChange: ({ data: { swapsConnection: { totalCount } } }) => {
        isLoadingSwapOffersCount.value = false
        swapOffersCount.value = totalCount
        swapOfferSubscription.value()
      },
    })
  }
}, { immediate: true })
</script>
