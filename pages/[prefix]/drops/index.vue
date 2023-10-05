<template>
  <Drops />
</template>

<script lang="ts" setup>
import Drops from '@/components/drops/Drops.vue'

const route = useRoute()

useSeoMeta({
  title: 'Drops',
  description: 'View all drops',
  ogUrl: route.path,
})
</script>
