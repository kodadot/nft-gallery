<template>
  <div ref="eventsContainer">
    <div v-if="events.length > 0">
      <div v-if="desktop" class="columns is-size-7 has-text-grey">
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
      <div
        v-if="!displayedEvents.length"
        class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center py-6">
        <span class="has-text-weight-bold is-size-5">{{
          $t('activity.noResults')
        }}</span>
        <span class="has-text-grey">{{ $t('activity.noResultsSub') }}</span>
      </div>
      <EventRow
        v-for="(event, i) in displayedEvents"
        :key="i"
        :variant="variant"
        :event="event" />
      <div ref="sentinel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EventRow from './EventRow.vue'
import { useIntersectionObserver } from '@vueuse/core'
import { Interaction } from '@kodadot1/minimark'
import { isAnyActivityFilterActive } from '../utils'
import { useResizeObserver } from '@vueuse/core'
import { mintInteraction } from '@/composables/collectionActivity/helpers'
import {
  InteractionWithNFT,
  Offer,
  OfferInteraction,
} from '@/composables/collectionActivity/types'

const desktop = ref(true)
const desktopBreakPoint = 1024
const eventsContainer = ref<HTMLDivElement | null>(null)
const variant = computed(() => (desktop.value ? 'Desktop' : 'Touch'))

const props = withDefaults(
  defineProps<{
    events: (InteractionWithNFT | Offer)[]
  }>(),
  {
    events: () => [],
  }
)

useResizeObserver(eventsContainer, (entry) => {
  if (entry[0].contentRect.width >= desktopBreakPoint) {
    desktop.value = true
  } else {
    desktop.value = false
  }
})

const offset = ref(10)

const filteredEvents = computed(() => {
  const query = useRoute().query
  const noFilterisActive = !isAnyActivityFilterActive()
  // don't filter events if no filter is applied
  if (noFilterisActive) {
    return props.events
  }

  const InteractionToKeep = {
    [Interaction.BUY]: is(query?.sale as string),
    [mintInteraction()]: is(query?.mint as string),
    [Interaction.LIST]: is(query?.listing as string),
    [Interaction.SEND]: is(query?.transfer as string),
    [OfferInteraction]: is(query?.offer as string),
  }

  return props.events.filter((event) => {
    return InteractionToKeep[event.interaction]
  })
})

const displayedEvents = ref<(InteractionWithNFT | Offer)[]>([])

const displayMoreEvents = () => {
  offset.value += 10
}

watch(
  [filteredEvents, offset],
  () => {
    displayedEvents.value = filteredEvents.value.slice(0, offset.value)
  },
  { immediate: true }
)

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  const target = entries[0]
  if (target.isIntersecting) {
    displayMoreEvents()
  }
}

const sentinel = ref<HTMLDivElement | null>(null)
useIntersectionObserver(sentinel, handleIntersection, { threshold: 0.66 })
</script>
