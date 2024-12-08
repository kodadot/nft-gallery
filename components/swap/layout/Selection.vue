<template>
  <SwapLayout>
    <template #title>
      <slot name="title" />
    </template>

    <div class="flex gap-6 flex-col-reverse md:flex-row">
      <div class="flex-1">
        <hr class="mb-6 mt-0">

        <slot />
      </div>
      <div class="w-auto">
        <slot name="preview" />
      </div>
    </div>
  </SwapLayout>
</template>

<script lang="ts" setup>
import { SwapStep } from '@/components/swap/types'

const swapStore = useAtomicSwapStore()
const { step } = storeToRefs(swapStore)
const { accountId } = useAuth()

watch(accountId, (account) => {
  swapStore.updateSwap({ creator: account ? account : undefined })
  if (step.value === SwapStep.OFFERED) {
    swapStore.updateStepItems([])
  }
})
</script>
