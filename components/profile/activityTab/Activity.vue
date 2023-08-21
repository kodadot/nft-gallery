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
          @click.native="all = !all" />
        <FilterButton
          v-for="{ label, urlParam } in filters"
          :key="urlParam"
          :label="label"
          :url-param="urlParam" />
      </div>
    </div>
    <hr class="my-0" />
    <History :id="id" :events="filteredEvents" />
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

const filters = [
  { label: 'Sale', urlParam: 'sale' },
  { label: 'Gift', urlParam: 'gift' },
  { label: 'Mint', urlParam: 'mint' },
  { label: 'List', urlParam: 'list' },
  { label: 'Buy', urlParam: 'buy' },
]

const all = computed({
  get: () => route.query.all === 'true',
  set: (val) => {
    replaceUrl({ all: val })
  },
})

const activeFilters = computed(() => {
  if (all.value) {
    return ['all']
  }

  return filters
    .filter((f) => route.query[f.urlParam] === 'true')
    .map((f) => f.urlParam)
})

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

const filteredEvents = computed(() => {
  if (activeFilters.value.includes('all')) {
    return events.value
  }

  return events.value.filter(({ interaction, caller }) => {
    if (interaction === InteractionEnum.BUY) {
      return activeFilters.value.includes(caller === props.id ? 'buy' : 'sale')
    }
    return activeFilters.value.includes(interactionToFilterMap[interaction])
  })
})

onMounted(() => {
  const filterKeysPresentInUrl = filters.some(
    (filter) => filter.urlParam in route.query
  )

  if (!filterKeysPresentInUrl) {
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
