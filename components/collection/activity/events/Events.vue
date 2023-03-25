<template>
  <div v-if="events.length > 0">
    <div class="is-hidden-touch columns is-size-7 k-grey py-3">
      <div class="column">
        <span>item</span>
      </div>
      <div class="column">
        <span>event</span>
      </div>
      <div class="column">
        <span>amount</span>
      </div>
      <div class="column">
        <span>from</span>
      </div>
      <div class="column">
        <span>to</span>
      </div>
      <div class="column">
        <span>time</span>
      </div>
    </div>
    <div>
      <EventRow
        v-for="event in displayedEvents"
        :key="event.id"
        :event="event"
        class="my-2 event-row-transition" />
      <div ref="sentinel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { InteractionWithNFT, Offer } from '@/components/collection/utils/types'
import EventRow from './EventRow.vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    events: (InteractionWithNFT | Offer)[]
  }>(),
  {
    events: () => [],
  }
)

const displayedEvents = ref<(InteractionWithNFT | Offer)[]>([])

watch(
  () => props.events,
  () => (displayedEvents.value = props.events.slice(0, 10)),
  { immediate: true }
)

let offset = 10

const displayMoreEvents = () => {
  displayedEvents.value = [
    ...displayedEvents.value,
    ...props.events.slice(offset, offset + 10),
  ]
  offset += 10
}

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  const target = entries[0]
  if (target.isIntersecting) {
    displayMoreEvents()
  }
}

const sentinel = ref<HTMLDivElement | null>(null)
useIntersectionObserver(sentinel, handleIntersection, { threshold: 0.66 })
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
