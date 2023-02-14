<template>
  <a :href="id ? url + id : url" target="_blank" rel="noopener noreferrer">
    <slot />
  </a>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    id: string
    url: string
  }>(),
  {
    id: '',
    url: '',
  }
)
</script>
