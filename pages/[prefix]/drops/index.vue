<template>
  <Drops />
</template>

<script lang="ts" setup>
const route = useRoute()

useSeoMeta({
  title: 'Drops',
  description: 'View all drops',
  ogUrl: route.path,
})

definePageMeta({
  layout: 'no-footer',
})
</script>
