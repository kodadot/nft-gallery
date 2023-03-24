<template>
  <div>
    <EventRowDesktop :event="event" />
    <!-- <EventRowTablet :event="event" class="is-hidden-desktop is-hidden-mobile" /> -->
  </div>
</template>

<script setup lang="ts">
import { InteractionWithNFT } from '../../utils/types'
import EventRowDesktop from './eventRow/EventRowDesktop.vue'
import EventRowTablet from './eventRow/EventRowTablet.vue'

defineProps<{ event: InteractionWithNFT }>()
</script>
