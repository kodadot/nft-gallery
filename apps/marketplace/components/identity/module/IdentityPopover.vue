<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="[100, 800]"
    data-cy="identity">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container p-4 ms-dos-shadow">
      <IdentityPopoverHeader />
      <hr style="height: 1px" class="m-0" />
      <IdentityPopoverFooter />
    </div>
  </v-tippy>
</template>

<script lang="ts" setup>
const IdentityPopoverHeader = defineAsyncComponent(
  () => import('./IdentityPopoverHeader.vue')
)
const IdentityPopoverFooter = defineAsyncComponent(
  () => import('./IdentityPopoverFooter.vue')
)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.tippy-container {
  display: inline-block;
}

.popover-content-container {
  border: 2px solid $primary;
  max-width: 350px;
}

.ms-dos-shadow {
  box-shadow: $dropdown-content-shadow;
}
</style>
