<template>
  <div class="is-flex">
    <SidebarFilter />
    <div class="w-full mt-5">
      <div class="columns">
        <div class="column is-two-thirds-desktop is-half-tablet">
          <ActivityChart :events="events" />
        </div>
        <div class="column">
          <OwnerInsights :owners="owners" :flippers="flippers" />
        </div>
      </div>
      <!-- <div v-show="isFiltersActive" class="border-bottom pb-5 border-k-grey">
        <BreadcrumbsFilter @filtersActive="toggleBreadcrumbsVisible" />
      </div> -->
      <Events :events="sortedEvents" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarFilter from '@/components/explore/SidebarFilter.vue'
import ActivityChart from './Chart.vue'
import OwnerInsights from './OwnerInsights.vue'
import Events from './events/Events.vue'
import BreadcrumbsFilter from '@/components/shared/BreadcrumbsFilter.vue'
import { useCollectionActivity } from '~~/components/collection/utils/useCollectionActivity'
import { Interaction } from '@kodadot1/minimark'
const route = useRoute()

const isFiltersActive = ref(false)

const toggleBreadcrumbsVisible = (active: boolean) => {
  isFiltersActive.value = active
}

const collectionId = computed(() => route.params.id)
const { events, flippers, owners, offers } = useCollectionActivity({
  collectionId: collectionId.value,
})

const InteractionIncluded = [
  Interaction.BUY,
  Interaction.LIST,
  Interaction.MINTNFT,
  Interaction.SEND,
]

const filteredEvents = computed(() =>
  events.value.filter((event) =>
    InteractionIncluded.includes(event.interaction as Interaction)
  )
)
const withOffers = computed(() => [...filteredEvents.value, ...offers.value])

const sortedEvents = computed(() =>
  withOffers.value.sort((a, b) => b.timestamp - a.timestamp)
)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.border-k-grey {
  @include ktheme() {
    border-color: theme('k-grey');
  }
}
</style>
