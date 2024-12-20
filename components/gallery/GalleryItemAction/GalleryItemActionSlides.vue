<template>
  <div
    class="slide flex"
    :class="{ 'slide-active': active, 'slide-disabled': disabled }"
  >
    <slot name="entry" />

    <div class="slide-action">
      <slot name="action" />
    </div>
    <div class="slide-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean
  disabled?: boolean
}>()
</script>
