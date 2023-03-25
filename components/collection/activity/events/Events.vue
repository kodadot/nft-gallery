<template>
  <div v-if="events.length > 0">
    <div class="is-hidden-touch columns is-size-7 k-grey py-3">
      <div class="column">
        <span>{{ $t('activity.event.item') }}</span>
      </div>
      <div class="column">
        <span>{{ $t('activity.event.event') }}</span>
      </div>
      <div class="column">
        <span>{{ $t('activity.event.amount') }}</span>
      </div>
      <div class="column">
        <span>{{ $t('activity.event.from') }}</span>
      </div>
      <div class="column">
        <span>{{ $t('activity.event.to') }}</span>
      </div>
      <div class="column">
        <span>{{ $t('activity.event.time') }}</span>
      </div>
    </div>
    <div>
      {{ displayedEvents.length }}
      <EventRow
        v-for="event in displayedEvents"
        :key="event.timestamp"
        :event="event"
        class="my-2 event-row-transition" />
      <div ref="sentinel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  InteractionWithNFT,
  Offer,
  OfferInteraction,
} from '@/components/collection/utils/types'
import EventRow from './EventRow.vue'
import { useIntersectionObserver } from '@vueuse/core'
import { Interaction } from '@kodadot1/minimark'

const props = withDefaults(
  defineProps<{
    events: (InteractionWithNFT | Offer)[]
  }>(),
  {
    events: () => [],
  }
)
const offset = ref(10)
const toKeep = (queryParam: string | undefined) => {
  if (queryParam === undefined) {
    return true
  }
  if (queryParam === 'true') {
    return true
  }
  return false
}

const filteredEvents = computed(() => {
  const route = useRoute()

  const InteractionToKeep = {
    [Interaction.BUY]: toKeep(route.query?.sale as string),
    [Interaction.MINTNFT]: toKeep(route.query?.mint as string),
    [Interaction.LIST]: toKeep(route.query?.listing as string),
    [Interaction.SEND]: toKeep(route.query?.transfer as string),
    [OfferInteraction]: toKeep(route.query?.offer as string),
  }

  return props.events.filter((event) => {
    return InteractionToKeep[event.interaction]
  })
})

const displayedEvents = ref<(InteractionWithNFT | Offer)[]>([])

const displayMoreEvents = () => {
  offset.value += 10
  console.log('offset', offset.value)
}

watch(
  [filteredEvents, offset],
  () => {
    displayedEvents.value = filteredEvents.value.slice(0, offset.value)
  },
  { immediate: true }
)

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  console.log('handleIntersection')
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
