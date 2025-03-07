<template>
  <ResponsiveTable
    :items="events"
    :no-results-main="$t('activity.noResults')"
    :no-results-sub="$t('activity.noResultsSub')"
    :show-no-results="events.length > 0 && !displayedEvents.length"
    :loading="loading"
    data-testid="nfts-event-table"
  >
    <template #columns>
      <div class="flex-1 mb-2">
        <span>{{ $t('activity.event.item') }}</span>
      </div>
      <div class="w-1/12">
        <span>{{ $t('activity.event.event') }}</span>
      </div>
      <div class="flex-1">
        <span>{{ $t('activity.event.amount') }}</span>
      </div>
      <div class="flex-1">
        <span>{{ $t('activity.event.from') }}</span>
      </div>
      <div class="flex-1">
        <span>{{ $t('activity.event.to') }}</span>
      </div>
      <div class="flex-1">
        <span>{{ $t('activity.event.time') }}</span>
      </div>
    </template>

    <template #rows="{ variant }">
      <EventRow
        v-for="event in displayedEvents.slice(0, displayedEvents.length - 1)"
        :key="event.id"
        :variant="variant"
        :event="event"
      />
      <div ref="sentinel" />
      <EventRow
        :variant="variant"
        :event="displayedEvents[displayedEvents.length - 1]"
      />
    </template>
  </ResponsiveTable>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { isAnyActivityFilterActive, isAnyEventTypeFilterActive } from '../utils'
import EventRow from './EventRow.vue'
import { blank, getFromAddress, getToAddress } from './eventRow/common'
import { Interaction } from '@/utils/shoppingActions'
import { mintInteraction } from '@/composables/collectionActivity/helpers'
import type { InteractionWithNFT } from '@/composables/collectionActivity/types'
import ResponsiveTable from '@/components/shared/ResponsiveTable.vue'
import { toSubstrateAddress } from '@/services/profile'

const props = withDefaults(
  defineProps<{
    events: InteractionWithNFT[]
    loading: boolean
  }>(),
  {
    events: () => [],
    loading: false,
  },
)

const route = useRoute()

const isOnlyVerifiedUsersFilterActive = computed(() =>
  is(route.query?.verified as string),
)

const offset = ref(10)

const filteredEvents = computed(() => {
  const query = route.query
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
  }

  const identityIds = profiles.value?.map(profile => profile?.address) || []

  const filterByVerifiedIdentity = isOnlyVerifiedUsersFilterActive.value

  return props.events.filter((event) => {
    const isActiveEvent = filterByVerifiedIdentity
      ? getEventAddresses(event)
        .map(toSubstrateAddress)
        .some(x => identityIds.includes(x))
      : true

    if (!isAnyEventTypeFilterActive()) {
      return isActiveEvent
    }

    return InteractionToKeep[event.interaction] && isActiveEvent
  })
})

const getEventAddresses = (event): string[] => {
  return [getFromAddress(event), getToAddress(event)].filter(
    address => address !== blank,
  )
}

const eventsAddresses = computed(() => {
  const addresses = props.events.map(getEventAddresses).flat()
  return [...new Set([...addresses])]
})

const { data: profiles } = useProfiles('profiles', eventsAddresses, { staleTime: 1000 * 60 * 5 })

const displayedEvents = ref<InteractionWithNFT[]>([])

const displayMoreEvents = () => {
  offset.value += 10
}

watch(
  [filteredEvents, offset],
  () => {
    displayedEvents.value = filteredEvents.value.slice(0, offset.value)
  },
  { immediate: true },
)

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  const target = entries[0]
  if (
    target.isIntersecting
    && displayedEvents.value.length < filteredEvents.value.length
  ) {
    displayMoreEvents()
  }
}
const sentinel = ref<HTMLDivElement | null>(null)
useIntersectionObserver(sentinel, handleIntersection, { threshold: 0.66 })
</script>
