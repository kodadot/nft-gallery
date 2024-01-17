<template>
  <NeoCollapse
    :open="expanded"
    animation="slide"
    class="border-b"
    :class="{ 'fluid-padding-left': fluidPadding }">
    <template #trigger="{ open }">
      <div class="flex" role="button" :aria-expanded="open">
        <p class="card-header-title has-text-weight-normal">
          {{ $t('filters.identityVerification') }}
        </p>
        <a class="card-header-icon">
          <NeoIcon :icon="open ? 'minus' : 'plus'" />
        </a>
      </div>
    </template>
    <div class="p-4">
      <NeoField>
        <NeoCheckbox
          v-model="onlyVerified"
          data-testid="event-checkbox-filter-only-verified-identities"
          >{{ $t('filters.onlyVerifiedIdentities') }}</NeoCheckbox
        >
      </NeoField>
    </div>
  </NeoCollapse>
</template>

<script lang="ts" setup>
import { useAcivityFiltersStore } from '@/stores/activityFilters'
import { NeoCheckbox, NeoCollapse, NeoField, NeoIcon } from '@kodadot1/brick'

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

const onlyVerified =
  props.dataModel === 'query'
    ? computed({
        get: () => route.query?.verified?.toString() === 'true',
        set: (value) => applyToUrl({ verified: String(value) }),
      })
    : computed({
        get: () => activityFiltersStore.getEventTypeFilters.sale,
        set: (value) => activityFiltersStore.setVerified(value),
      })

const applyToUrl = (queryCondition: { [key: string]: any }) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
