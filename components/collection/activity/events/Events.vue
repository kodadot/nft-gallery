<template>
  <div v-if="events.length > 0">
    <div class="is-hidden-touch columns is-size-7 k-grey">
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
      <EventRow
        v-for="event in displayedEvents"
        :key="event.timestamp"
        :event="event" />
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
import { is, readParam } from '@/components/shared/filters/filterUtils'

const props = withDefaults(
  defineProps<{
    events: (InteractionWithNFT | Offer)[]
  }>(),
  {
    events: () => [],
  }
)
const offset = ref(10)

const filteredEvents = computed(() => {
  const query = useRoute().query
  const isAnyFilterActive =
    readParam(query.sale) ||
    readParam(query.listing) ||
    readParam(query.mint) ||
    readParam(query.transfer) ||
    readParam(query.offer)
  // don't filter events if no filter is applied
  if (!isAnyFilterActive) {
    return props.events
  }

  const InteractionToKeep = {
    [Interaction.BUY]: is(query?.sale as string),
    [Interaction.MINTNFT]: is(query?.mint as string),
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

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
