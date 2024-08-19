<template>
  <div>
    <EventRowDesktop
      v-if="variant === 'Desktop'"
      :event="event"
    />
    <EventRowTablet
      v-else
      :event="event"
    />
  </div>
</template>

<script setup lang="ts">
import EventRowDesktop from './eventRow/EventRowDesktop.vue'
import EventRowTablet from './eventRow/EventRowTablet.vue'
import type {
  InteractionWithNFT,
  Offer,
} from '@/composables/collectionActivity/types'

defineProps<{
  event: InteractionWithNFT | Offer
  variant: 'Touch' | 'Desktop'
}>()
</script>
