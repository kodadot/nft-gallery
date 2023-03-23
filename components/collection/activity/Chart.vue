<template>
  <GalleryItemChart :nft-events="events" />
</template>

<script setup lang="ts">
import { ActivityInteraction } from '@/components/rmrk/service/scheme'

defineProps<{
  events?: ActivityInteraction[]
}>()
</script>
