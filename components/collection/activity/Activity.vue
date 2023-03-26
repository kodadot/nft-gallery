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
        <hr class="my-0" />
      </div>
      <div v-if="mobile">
        <div class="is-flex is-flex-direction-column gap">
          <OwnerInsights :owners="owners" :flippers="flippers" />
          <div class="max-width">
            <ActivityChart :events="events" />
          </div>
        </div>
      </div>
      <Events :events="sortedEvents" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ActivityChart from './Chart.vue'
import OwnerInsights from './OwnerInsights.vue'
import Events from './events/Events.vue'
import BreadcrumbsFilter from '@/components/shared/BreadcrumbsFilter.vue'
import { useCollectionActivity } from '@/components/collection/utils/useCollectionActivity'
import { Interaction } from '@kodadot1/minimark'
import { useResizeObserver, useWindowSize } from '@vueuse/core'
import SidebarFilter from '@/components/shared/filters/SidebarFilter.vue'
// const sidebarwidth = 55
const mobileBreakpoint = 800
// const windowWidth = useWindowSize().width.value
const route = useRoute()
const tablet = ref(true)
const mobile = ref(false)
const wrapper = ref<HTMLDivElement | null>(null)

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

useResizeObserver(wrapper, (entry) => {
  if (entry[0].contentRect.width >= mobileBreakpoint) {
    tablet.value = true
    mobile.value = false
  } else {
    tablet.value = false
    mobile.value = true
  }
})
</script>

<style lang="scss" scoped>
.gap {
  gap: 2.5rem;
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
