<template>
  <div>
    <History
      :id="id"
      :events="filteredEvents"
      display-item
    >
      <template
        #header="{ currentPage, total, perPage, desktop, updateCurrentPage }"
      >
        <div class="flex justify-between pb-4 pt-5 content-center">
          <div class="flex gap-4 items-center flex-wrap">
            <NeoButton
              no-shadow
              rounded
              data-testid="profile-activity-button-all"
              label="All"
              variant="text"
              @click="activateAllFilter"
            />
            <FilterButton
              v-for="param in filters"
              :key="param"
              :label="param"
              variant="outlined-rounded"
              data-testid="profile-activity-button-filter"
              class="capitalize"
              :url-param="param"
            />
          </div>
          <div v-if="desktop">
            <Pagination
              :value="currentPage"
              :total="total"
              :per-page="perPage"
              :range-before="2"
              :range-after="2"
              replace
              enable-listen-keyboard-event
              preserve-scroll
              @input="updateCurrentPage"
            />
          </div>
        </div>
        <hr class="my-0">
      </template>
    </History>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import History from './History.vue'
import { Interaction as InteractionEnum } from '@/utils/shoppingActions'
import { sortedEventByDate } from '@/utils/sorting'
import FilterButton from '@/components/profile/FilterButton.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const events = ref<InteractionEnum[]>([])

const props = defineProps<{
  id: string
}>()

const filters = ['sale', 'buy', 'mint', 'transfer', 'list']

const activateAllFilter = () => {
  replaceUrl(
    filters.reduce(
      (queryParams, filter) => ({ ...queryParams, [filter]: true }),
      {},
    ),
  )
}

const activeFilters = computed(() =>
  filters.filter(queryParam => route.query[queryParam] === 'true'),
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
  [InteractionEnum.SEND]: 'transfer',
}

const filteredEvents = computed(() =>
  events.value.filter(({ interaction, caller }) => {
    if (interaction === InteractionEnum.BUY) {
      return activeFilters.value.includes(caller === props.id ? 'buy' : 'sale')
    }
    return activeFilters.value.includes(interactionToFilterMap[interaction])
  }),
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
