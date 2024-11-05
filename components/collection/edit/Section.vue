<template>
  <div>
    <p>{{ title }}</p>

    <hr class="!my-4">

    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>
