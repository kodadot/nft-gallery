<template>
  <figure>
    <img class="is-block" :src="src" :alt="alt" data-cy="type-image" />
  </figure>
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
  alt?: string
}>()
</script>
