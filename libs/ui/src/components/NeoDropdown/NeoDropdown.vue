<template>
  <o-dropdown
    aria-role="list"
    :position="position"
    :append-to-body="appendToBody"
    class="neo-dropdown"
    :class="{ 'o-drop-active': isActive }"
    :mobile-modal="mobileModal"
    @active-change="onActiveChange($event)">
    <template #trigger>
      <slot />
    </template>
    <slot name="items" />
  </o-dropdown>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue'
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

const emit = defineEmits(['active-change'])

function onActiveChange(event) {
  isActive.value = event
  emit('active-change', event)
}
</script>

<style lang="scss">
@import './NeoDropdown.scss';
</style>
