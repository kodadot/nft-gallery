<template>
  <div>
    <EventRowDesktop v-if="variant === 'Desktop'" :event="event" />
    <EventRowTablet v-else :event="event" />
  </div>
</template>

<script setup lang="ts">
import { InteractionWithNFT, Offer } from '@/components/collection/utils/types'
import EventRowDesktop from './eventRow/EventRowDesktop.vue'
import EventRowTablet from './eventRow/EventRowTablet.vue'

defineProps<{
  event: InteractionWithNFT | Offer
  variant: 'Touch' | 'Desktop'
}>()
</script>
