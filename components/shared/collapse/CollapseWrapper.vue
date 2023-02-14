<template>
  <div>
    <b-collapse
      :open="isOpen"
      :position="position"
      aria-id="contentIdForA11y1"
      :class="{ 'is-unselectable': !isSelectable }">
      <template #trigger="props">
        <a aria-controls="contentIdForA11y1" class="mb-2">
          <b-icon
            class="collapse-icon"
            :icon="!props.open ? 'eye' : 'eye-slash'"></b-icon>
          <span class="pl-1">{{ $t(!props.open ? visible : hidden) }}</span>
        </a>
      </template>
      <slot class="mt-2"></slot>
    </b-collapse>
  </div>
</template>

<script lang="ts" setup>
const cprops = withDefaults(
  defineProps<{
    visible: string
    hidden: string
    bottom: boolean
    isSelectable: boolean
  }>(),
  {
    visible: 'Show',
    hidden: 'Hide',
    bottom: false,
    isSelectable: false,
  }
)
const isOpen = ref(false)
const position = computed(() => (cprops.bottom ? 'is-bottom' : 'is-top'))
</script>
