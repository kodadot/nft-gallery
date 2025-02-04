<template>
  <section class="grow relative w-full max-w-none mx-auto my-0 md:!px-10 !px-5 flex flex-col">
    <div class="flex my-14 flex-wrap gap-10 justify-between">
      <slot name="title" />

      <SwapBannerAccounts
        :creator="swap.creator"
        :counterparty="swap.counterparty"
      />
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
const { swap } = storeToRefs(useAtomicSwapStore())
</script>
