<template>
  <div>
    <div
      class="is-flex is-justify-content-space-between pb-4 pt-5 is-align-content-center">
      <div class="is-flex gap-4">
        <FilterButton
          v-for="{ label, urlParam, btnVariant } in filters"
          :key="urlParam"
          :label="label"
          :variant="btnVariant"
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
import { NeoButtonVariant } from '@kodadot1/brick'
const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const events = ref<Interaction[]>([])

const props = defineProps<{
  id: string
}>()

const filters = [
  { label: 'All', urlParam: 'all', btnVariant: 'text' as NeoButtonVariant },
  { label: 'Sale', urlParam: 'sale' },
  { label: 'Gift', urlParam: 'gift' },
  { label: 'Mint', urlParam: 'mint' },
  { label: 'List', urlParam: 'list' },
  { label: 'Buy', urlParam: 'buy' },
]

const activeFilters = computed(() => {
  return filters
    .filter((f) => route.query[f.urlParam || f.label] === 'true')
    .map((f) => f.urlParam || f.label)
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
