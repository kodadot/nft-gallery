<template>
  <div
    ref="wrapper"
    class="is-flex"
    :class="{ 'is-justify-content-center': mobile }">
    <SidebarFilter />
    <div class="w-full mt-5">
      <div v-if="tablet">
        <div class="columns">
          <div class="column is-two-thirds-desktop is-half-tablet">
            <ActivityChart :events="events" />
          </div>
          <div class="column">
            <OwnerInsights :owners="owners" :flippers="flippers" />
          </div>
        </div>
        <BreadcrumbsFilter />
        <hr class="my-0" />

        <Events :events="sortedEvents" />
      </div>
      <div v-if="mobile">
        <div class="is-flex is-flex-direction-column gap">
          <OwnerInsights :owners="owners" :flippers="flippers" />
          <ActivityChart :events="events" />
          <Events :events="sortedEvents" />
        </div>
      </div>
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
import SidebarFilter from '@/components/explore/SidebarFilter.vue'
import useReplaceUrl from '@/components/explore/filters/useReplaceUrl'
const sidebarwidth = 55
const mobileBreakpoint = 768 + sidebarwidth
const windowWidth = useWindowSize().width.value
const route = useRoute()
const tablet = ref(windowWidth > mobileBreakpoint)
const mobile = ref(windowWidth <= mobileBreakpoint)
const wrapper = ref<HTMLDivElement | null>(null)
const { replaceUrl } = useReplaceUrl({ resetPage: false })

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

useResizeObserver(
  wrapper,
  (entry) => {
    if (entry[0].contentRect.width >= mobileBreakpoint) {
      tablet.value = true
      mobile.value = false
    } else {
      tablet.value = false
      mobile.value = true
    }
  },
  {}
)

onMounted(() => {
  const statusDefaults = {
    sale: true,
    offer: true,
    listing: true,
    mint: true,
    transfer: true,
  }
  replaceUrl(statusDefaults)
})
</script>

<style lang="scss" scoped>
.gap {
  gap: 2.5rem;
}
</style>
