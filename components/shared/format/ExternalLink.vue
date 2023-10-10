<template>
  <a
    v-safe-href="id ? url + id : url"
    target="_blank"
    rel="nofollow noopener noreferrer">
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
  },
)
</script>
