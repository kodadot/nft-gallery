<template>
  <div>
    <div
      class="is-flex is-justify-content-space-between pb-4 pt-5 is-align-content-center">
      <div class="is-flex gap-4">
        <NeoButton
          no-shadow
          rounded
          label="All"
          variant="text"
          @click.native="activateAllFilter" />
        <FilterButton
          v-for="urlParam in filters"
          :key="urlParam"
          class="is-capitalized"
          :url-param="urlParam" />
      </div>
    </div>
    <hr class="my-0" />
    <History v-if="filteredEvents.length" :id="id" :events="filteredEvents" />
    <EmptyResult v-else />
  </div>
</template>

<script lang="ts" setup>
import History from './History.vue'
import { Interaction } from '@/components/rmrk/service/scheme'
import { sortedEventByDate } from '@/utils/sorting'
import FilterButton from '@/components/profile/FilterButton.vue'
import { Interaction as InteractionEnum } from '@kodadot1/minimark/v1'
import { NeoButton } from '@kodadot1/brick'
const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const events = ref<Interaction[]>([])

const props = defineProps<{
  id: string
}>()

const filters = ['sale', 'buy', 'mint', 'gift', 'list']

const activateAllFilter = () => {
  // Avoid redundant navigation to current location
  if (activeFilters.value.length === filters.length) {
    return
  }
  replaceUrl(
    filters.reduce(
      (queryParams, filter) => ({ ...queryParams, [filter]: true }),
      {}
    )
  )
}

const activeFilters = computed(() =>
  filters.filter((queryParam) => route.query[queryParam] === 'true')
)

const { data } = useGraphql({
  queryName: 'allEventsByProfile',
  variables: {
    id: props.id,
  },
})

watch(data, () => {
  events.value = [...sortedEventByDate(data.value?.events || [], 'DESC')]
})

const interactionToFilterMap = {
  [InteractionEnum.MINT]: 'mint',
  [InteractionEnum.MINTNFT]: 'mint',
  [InteractionEnum.LIST]: 'list',
  [InteractionEnum.SEND]: 'gift',
}

const filteredEvents = computed(() =>
  events.value.filter(({ interaction, caller }) => {
    if (interaction === InteractionEnum.BUY) {
      return activeFilters.value.includes(caller === props.id ? 'buy' : 'sale')
    }
    return activeFilters.value.includes(interactionToFilterMap[interaction])
  })
)

onMounted(() => {
  const noFiltersActive = activeFilters.value.length === 0

  if (noFiltersActive) {
    // Activate 'buy' and 'sale' filters by default
    replaceUrl({
      buy: 'true',
      sale: 'true',
    })
  }
})
</script>

<style scoped lang="scss">
.gap-4 {
  gap: 1rem;
}
</style>
