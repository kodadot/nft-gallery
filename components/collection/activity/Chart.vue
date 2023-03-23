<template>
  <GalleryItemChart :nft-events="events" chart-height="350px" />
</template>

<script setup lang="ts">
import { ActivityInteraction } from '@/components/rmrk/service/scheme'

defineProps<{
  events?: ActivityInteraction[]
}>()
</script>
