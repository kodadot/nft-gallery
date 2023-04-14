<template>
  <div class="is-flex">
    <SidebarFilter />
    <div ref="wrapper" class="w-full mt-5">
      <div v-if="tablet">
        <div class="columns">
          <div class="column is-two-thirds">
            <ActivityChart :events="events" />
          </div>
          <div class="column">
            <OwnerInsights :owners="owners" :flippers="flippers" />
          </div>
        </div>
        <BreadcrumbsFilter />
      </div>
      <div v-else>
        <div class="is-flex is-flex-direction-column gap">
          <OwnerInsights :owners="owners" :flippers="flippers" />
          <div class="max-width">
            <ActivityChart :events="events" />
          </div>
        </div>
      </div>
      <hr class="mb-40" :class="{ 'my-40': !isBreadCrumbsShowing }" />
      <Events :events="sortedEventsWithOffersDesc" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ActivityChart from './ActivityChart.vue'
import OwnerInsights from './OwnerInsights.vue'
import Events from './events/Events.vue'
import BreadcrumbsFilter from '@/components/shared/BreadcrumbsFilter.vue'
import { Interaction } from '@kodadot1/minimark/v1'
import { useResizeObserver } from '@vueuse/core'
import SidebarFilter from '@/components/shared/filters/SidebarFilter.vue'
import { isAnyActivityFilterActive } from './utils'
import { mintInteraction } from '@/composables/collectionActivity/helpers'
import { useCollectionActivity } from '@/composables/collectionActivity/useCollectionActivity'
const mobileBreakpoint = 800
const route = useRoute()
const tablet = ref(true)
const wrapper = ref<HTMLDivElement | null>(null)

const isBreadCrumbsShowing = computed(
  () => isAnyActivityFilterActive() && tablet.value
)

const collectionId = computed(() => route.params.id)
const { events, flippers, owners, offers } = useCollectionActivity({
  collectionId: collectionId.value,
})

const InteractionIncluded = [
  Interaction.BUY,
  Interaction.LIST,
  mintInteraction(),
  Interaction.SEND,
]

const filteredEvents = computed(() =>
  events.value.filter((event) =>
    InteractionIncluded.includes(event.interaction as Interaction)
  )
)
const withOffers = computed(() => [...filteredEvents.value, ...offers.value])

// newest events first (bigger timestamp first)
const sortedEventsWithOffersDesc = computed(() =>
  withOffers.value.sort((a, b) => b.timestamp - a.timestamp)
)

useResizeObserver(wrapper, (entry) => {
  if (entry[0].contentRect.width >= mobileBreakpoint) {
    tablet.value = true
  } else {
    tablet.value = false
  }
})
</script>

<style lang="scss" scoped>
.gap {
  gap: 2.5rem;
}
.my-40 {
  margin: 2.5rem 0;
}
.mb-40 {
  margin-bottom: 2.5rem;
}
.is-flex-basis-two-thirds {
  flex-basis: 66.6%;
}
.is-flex-basis-auto {
  flex-basis: auto;
}

//hack to make the chart responsive
.max-width {
  max-width: calc(100% - 1px);
}
</style>
