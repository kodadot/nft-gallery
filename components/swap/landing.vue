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
        <a
          class="text-k-blue hover:text-k-blue-hover"
          href="https://hello.kodadot.xyz/tutorial/swaps"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {{ $t('swap.learnMoreAboutSwaps') }}
        </a>
      </div>

      <div>
        <h2 class="mb-2 font-bold text-text-color capitalize">
          {{ $t('swap.connectTrader') }}
        </h2>
        <p>
          {{ $t('swap.connectTraderInfo') }}
        </p>
      </div>

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
          class="text-base my-5 capitalize"
          expanded
          :disabled="disabled"
          native-type="submit"
          variant="primary"
        />
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

const { isCurrentAccount } = useAuth()
const { $i18n } = useNuxtApp()

const traderAddress = ref('')
const isTraderAddressValid = ref(false)
const isYourAddress = ref(false)

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
</script>
