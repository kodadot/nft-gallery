<template>
  <div>
    <div class="flex justify-between py-5 content-center">
      <div class="flex gap-4 items-center flex-wrap">
        <FilterButton
          v-for="({ id, icon }) in filters"
          :key="id"
          :label="id"
          variant="outlined-rounded"
          data-testid="profile-activity-button-filter"
          class="capitalize"
          :icon-left="icon"
          :url-param="id"
        />
      </div>

      <!-- <Pagination
        class="max-md:hidden"
        :value="currentPage"
        :total="total"
        :per-page="perPage"
        :range-before="2"
        :range-after="2"
        replace
        enable-listen-keyboard-event
        preserve-scroll
        @input="updateCurrentPage"
      /> -->
    </div>

    <hr class="mb-10 mt-0">

    <div>
      <ResponsiveTable
        :no-results-main="$t('activity.noResults')"
        :no-results-sub="$t('activity.noResultsSub')"
        :items="offers"
        :show-no-results="!offers.length"
        :loading="loading"
      >
        <template #columns>
          <div class="flex-1">
            <span>{{ $t('activity.event.item') }}</span>
          </div>
          <div class="w-1/12">
            <span>{{ $t('activity.event.event') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.amount') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.to') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.time') }}</span>
          </div>
          <div class="flex-1">
            <span />
          </div>
        </template>

        <template #rows="{ variant }">
          <ProfileActivityTabOfferRow
            v-for="item in offers"
            :key="item.id"
            data-testid="offer-item-row"
            :offer="item"
            :variant="variant as unknown"
            with-to-column
          />
        </template>
      </ResponsiveTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FilterButton from '@/components/profile/FilterButton.vue'
// import Pagination from '@/components/rmrk/Gallery/Pagination.vue'

const filters = [{
  id: 'outgoing',
  icon: 'arrow-up',
}, {
  id: 'incoming',
  icon: 'arrow-down',
}]

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const activeFilters = computed(() =>
  filters.filter(queryParam => route.query[queryParam.id] === 'true').map(filter => filter.id),
)

const isIncomingActive = computed(() => activeFilters.value.includes('incoming'))
const isOutgoingActive = computed(() => activeFilters.value.includes('outgoing'))

const where = computed(() => {
  const conditions = [] as Record<string, unknown>[]

  const outgoing = {
    caller_eq: props.id,
    status_eq: 'ACTIVE',
  }

  const incoming = {
    desired: { currentOwner_eq: props.id },
    status_eq: 'ACTIVE',
  }

  if (isOutgoingActive.value) {
    conditions.push(outgoing)
  }

  if (isIncomingActive.value) {
    conditions.push(incoming)
  }

  return isOutgoingActive.value || isIncomingActive.value ? { OR: conditions } : { AND: [outgoing, incoming] }
})

const { offers, loading } = useOffers({ where })

onMounted(() => {
  const noFiltersActive = activeFilters.value.length === 0
  if (noFiltersActive) {
    replaceUrl({
      outgoing: 'true',
    })
  }
})
</script>

<style scoped lang="scss">
.gap-4 {
  gap: 1rem;
}
</style>
