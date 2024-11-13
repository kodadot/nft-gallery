<template>
  <section class="container is-fluid flex flex-col">
    <div class="flex my-14 flex-wrap gap-10 justify-between">
      <slot name="title" />

      <SwapBannerAccounts :counterparty="swap.counterparty" />
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
const swapStore = useAtomicSwapsStore()
const { swap } = storeToRefs(swapStore)
const { accountId } = useAuth()

watchEffect(() => {
  if (swap.value) {
    swapStore.updateItem({
      ...swap.value,
      creator: accountId.value ? accountId.value : undefined,
    })
  }
})
</script>
