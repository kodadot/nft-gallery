<template>
  <ResponsiveTable
    :items="events"
    :no-results-main="$t('activity.noResults')"
    :no-results-sub="$t('activity.noResultsSub')"
    :show-no-results="events.length > 0 && !displayedEvents.length"
    data-testid="nfts-event-table">
    <template #columns>
      <div class="column">
        <span>{{ $t('activity.event.item') }}</span>
      </div>
      <div class="column is-1">
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
    </template>

    <template #rows="{ variant }">
      <EventRow
        v-for="event in displayedEvents.slice(0, displayedEvents.length - 1)"
        :key="event.id"
        :variant="variant"
        :event="event" />
      <div ref="sentinel" />
      <EventRow
        :variant="variant"
        :event="displayedEvents[displayedEvents.length - 1]" />
    </template>
  </ResponsiveTable>
</template>

<script setup lang="ts">
import EventRow from './EventRow.vue'
import { useIntersectionObserver } from '@vueuse/core'
import { Interaction } from '@kodadot1/minimark/v1'
import { isAnyActivityFilterActive, isAnyEventTypeFilterActive } from '../utils'
import { mintInteraction } from '@/composables/collectionActivity/helpers'
import {
  InteractionWithNFT,
  Offer,
  OfferInteraction,
} from '@/composables/collectionActivity/types'
import ResponsiveTable from '@/components/shared/ResponsiveTable.vue'
import { blank, getFromAddress, getToAddress } from './eventRow/common'

const props = withDefaults(
  defineProps<{
    events: (InteractionWithNFT | Offer)[]
  }>(),
  {
    events: () => [],
  },
)

const route = useRoute()

const isOnlyVerifiedUsersFilterActive = computed(() =>
  is(route.query?.verified as string),
)

const { urlPrefix } = usePrefix()
const { getIdentityId, clientName } = useIdentityQuery(urlPrefix)

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
    [OfferInteraction]: is(query?.offer as string),
  }

  const identityIds =
    identities.value?.identities?.map((identity) => identity.id) || []

  const filterByVerifiedIdentity = isOnlyVerifiedUsersFilterActive.value

  return props.events.filter((event) => {
    const active = getEventAddresses(event)
      .map(getIdentityId)
      .some((x) => identityIds.includes(x))

    if (!isAnyEventTypeFilterActive() && filterByVerifiedIdentity) {
      return active
    }

    return InteractionToKeep[event.interaction] && active
  })
})

const getEventAddresses = (event): string[] => {
  return [getFromAddress(event), getToAddress(event)].filter(
    (address) => address !== blank,
  )
}

const eventsAddresses = computed(() => {
  const addresses = props.events.map(getEventAddresses).flat()

  return [...new Set([...addresses])].map(getIdentityId)
})

const { data: identities, refetch: getIdentities } = useGraphql({
  clientName,
  queryName: 'identities',
  disabled: computed(() => true),
  variables: { where: {} },
})

watch(
  eventsAddresses,
  () => {
    getIdentities({
      where: {
        id_in: eventsAddresses.value,
        display_isNull: false,
      },
    })
  },
  { immediate: true },
)

const displayedEvents = ref<(InteractionWithNFT | Offer)[]>([])

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
    target.isIntersecting &&
    displayedEvents.value.length < filteredEvents.value.length
  ) {
    displayMoreEvents()
  }
}
const sentinel = ref<HTMLDivElement | null>(null)
useIntersectionObserver(sentinel, handleIntersection, { threshold: 0.66 })
</script>
