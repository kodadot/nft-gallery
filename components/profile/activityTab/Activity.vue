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
          @click="activateAllFilter" />
        <FilterButton
          v-for="param in filters"
          :key="param"
          :label="param"
          class="is-capitalized"
          :url-param="param" />
      </div>
    </div>
    <hr class="my-0" />
    <History :id="id" :events="filteredEvents" display-item />
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

const filters = ['sale', 'buy', 'mint', 'transfer', 'list']

const activateAllFilter = () => {
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

const { client, urlPrefix } = usePrefix()
const queryPrefix = urlPrefix.value === 'ksm' ? 'chain-rmrk' : ''
const { data } = useGraphql({
  clientName: client.value,
  queryName: 'allEventsByProfile',
  queryPrefix,
  variables: {
    id: props.id,
  },
})

watch(data, () => {
  events.value = [...sortedEventByDate(data.value?.value.events || [], 'DESC')]
})

const interactionToFilterMap = {
  [InteractionEnum.MINT]: 'mint',
  [InteractionEnum.MINTNFT]: 'mint',
  [InteractionEnum.LIST]: 'list',
  [InteractionEnum.SEND]: 'transfer',
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
