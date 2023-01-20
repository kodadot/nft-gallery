<template>
  <o-dropdown
    aria-role="list"
    :position="position"
    :append-to-body="appendToBody"
    class="neo-dropdown"
    :class="{ 'o-drop-active': isActive }"
    :mobile-modal="mobileModal"
    @active-change="isActive = $event">
    <template #trigger>
      <slot />
    </template>
    <slot name="items" />
  </o-dropdown>
</template>

<script lang="ts" setup>
import { ODropdown } from '@oruga-ui/oruga'

const isActive = ref(false)

withDefaults(
  defineProps<{
    position?: string
    appendToBody?: boolean
    mobileModal?: boolean
  }>(),
  {
    position: 'bottom-left',
    appendToBody: false,
    mobileModal: false,
  }
)
</script>

<style lang="scss">
@import './NeoDropdown.scss';
</style>
