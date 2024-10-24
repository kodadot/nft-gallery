<template>
  <div class="max-w-[490px] mx-auto">
    <div class="flex flex-col h-full space-y-10 pt-8">
      <div>
        <div class="flex items-center">
          <img
            class="-ml-8"
            src="~/assets/svg/arrows.svg"
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
          placeholder="Enter wallet address"
          :strict="false"
          empty-on-error
          with-address-check
        />

        <NeoButton
          type="submit"
          :label="$t('swap.beginSwap')"
          size="large"
          class="text-base my-5 capitalize"
          expanded
          :disabled="traderAddress === '' || traderAddress === accountId"
          native-type="submit"
          variant="primary"
        />
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

const { accountId } = useAuth()

const traderAddress = ref('')

const handleSubmit = async () => {
  // check valid address
  await navigateTo({ name: 'prefix-swap-id', params: { id: traderAddress.value } })
}
</script>
