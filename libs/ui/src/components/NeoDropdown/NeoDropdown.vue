<template>
  <o-dropdown
    aria-role="list"
    :position="position"
    :append-to-body="appendToBody"
    class="neo-dropdown"
    :close-on-click="closeOnClick"
    :multiple="multiple"
    :class="{ 'o-drop-active': isActive }"
    :mobile-modal="mobileModal"
    :v-model="vModal"
    v-bind="$attrs"
    @change="onChange($event)"
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
    closeOnClick?: boolean
    multiple?: boolean
    vModal?: string | number | boolean | object | Array<unknown> | null
  }>(),
  {
    position: 'bottom-left',
    appendToBody: false,
    mobileModal: false,
    closeOnClick: true,
    multiple: false,
    vModal: null,
  }
)

const emit = defineEmits(['active-change', 'change'])

function onActiveChange(event) {
  isActive.value = event
  emit('active-change', event)
}

function onChange(event) {
  emit('change', event)
}
</script>

<style lang="scss">
@import './NeoDropdown.scss';
</style>
