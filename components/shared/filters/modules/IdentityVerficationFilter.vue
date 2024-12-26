<template>
  <SiderbarFilterSection
    :title="$t('filters.identityVerification')"
    :expanded="expanded"
    :fluid-padding="fluidPadding"
  >
    <NeoField>
      <NeoCheckbox
        v-model="onlyVerified"
        data-testid="event-checkbox-filter-only-verified-identities"
      >
        {{ $t('filters.onlyVerifiedIdentities') }}
      </NeoCheckbox>
    </NeoField>
  </SiderbarFilterSection>
</template>

<script lang="ts" setup>
import { NeoCheckbox, NeoField } from '@kodadot1/brick'
import { useAcivityFiltersStore } from '@/stores/activityFilters'

const activityFiltersStore = useAcivityFiltersStore()
const route = useRoute()
const { replaceUrl: replaceURL } = useReplaceUrl({ resetPage: false })

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

const emit = defineEmits(['resetPage'])

const onlyVerified
  = props.dataModel === 'query'
    ? computed({
      get: () => route.query?.verified?.toString() === 'true',
      set: value => applyToUrl({ verified: String(value) }),
    })
    : computed({
      get: () => activityFiltersStore.getEventTypeFilters.sale,
      set: value => activityFiltersStore.setVerified(value),
    })

const applyToUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
