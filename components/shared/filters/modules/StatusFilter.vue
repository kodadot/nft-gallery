<template>
  <SiderbarFilterSection
    :title="$t('massmint.status')"
    :expanded="expanded"
    :fluid-padding="fluidPadding"
  >
    <NeoField>
      <NeoCheckbox
        v-model="listed"
        data-testid="filter-checkbox-buynow"
      >
        {{ $t(ListedOrBuynow) }}
      </NeoCheckbox>
    </NeoField>
    <NeoField>
      <NeoCheckbox
        v-model="owned"
        :disabled="!accountId"
      >
        {{ $t('sort.own') }}
      </NeoCheckbox>
    </NeoField>
  </SiderbarFilterSection>
</template>

<script lang="ts" setup>
import { NeoCheckbox, NeoField } from '@kodadot1/brick'
import { useExploreFiltersStore } from '@/stores/exploreFilters'

const exploreFiltersStore = useExploreFiltersStore()
const route = useRoute()
const { accountId } = useAuth()
const { replaceUrl: replaceURL } = useReplaceUrl()

type DataModel = 'query' | 'store'

const props = withDefaults(
  defineProps<{
    expanded?: boolean
    dataModel?: DataModel
    fluidPadding?: boolean
  }>(),
  {
    expanded: false,
    dataModel: 'query',
    fluidPadding: false,
  },
)

const ListedOrBuynow = computed(() => 'sort.listed')

const emit = defineEmits(['resetPage'])

const listed
  = props.dataModel === 'query'
    ? computed({
      get: () => route.query?.listed?.toString() === 'true',
      set: value => applyToUrl({ listed: String(value) }),
    })
    : computed({
      get: () => exploreFiltersStore.listed,
      set: value => exploreFiltersStore.setListed(value),
    })

const owned
  = props.dataModel === 'query'
    ? computed({
      get: () => route.query?.owned?.toString() === 'true',
      set: value => applyToUrl({ owned: String(value) }),
    })
    : computed({
      get: () => exploreFiltersStore.owned,
      set: value => exploreFiltersStore.setOwned(value),
    })

const applyToUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
