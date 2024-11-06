<template>
  <section class="pt-5 container is-fluid flex flex-col space-y-10">
    <div class="flex justify-between">
      <slot name="title" />

      <SwapBannerAccounts :counterparty="String(route.params.id)" />
    </div>

    <div class="columns">
      <div class="column">
        <hr class="mb-6 mt-0">

        <slot />
      </div>
      <div class="column is-narrow">
        <slot name="preview" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
