<template>
  <section class="container-fluid flex flex-col">
    <div class="flex my-14 flex-wrap gap-10 justify-between">
      <slot name="title" />

      <SwapBannerAccounts
        :creator="swap.creator"
        :counterparty="swap.counterparty"
        :is-collection-swap="swap.isCollectionSwap"
      />
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
const { swap } = storeToRefs(useAtomicSwapStore())
</script>
