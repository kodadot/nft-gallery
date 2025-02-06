<template>
  <SiderbarFilterSection
    :title="$t('filters.tradeType', [tradeName])"
    :expanded="expanded"
    :fluid-padding="fluidPadding"
  >
    <NeoField>
      <NeoCheckbox
        v-model="entire_collection"
        data-testid="filter-checkbox-buynow"
      >
        {{ $t('filters.tradeCollection', [tradeName]) }}
      </NeoCheckbox>
    </NeoField>
  </SiderbarFilterSection>
</template>

<script lang="ts" setup>
import { NeoCheckbox, NeoField } from '@kodadot1/brick'

const emit = defineEmits(['resetPage'])
withDefaults(
  defineProps<{
    expanded?: boolean
    fluidPadding?: boolean
  }>(),
  {
    expanded: false,
    fluidPadding: false,
  },
)

const route = useRoute()
const { $i18n } = useNuxtApp()

const { replaceUrl: replaceURL } = useReplaceUrl()

const tradeName = computed(() => route.name === 'prefix-collection-id-swaps' ? $i18n.t('swaps') : $i18n.t('offers'))

const entire_collection = computed({
  get: () => route.query?.trade_collection?.toString() === 'true',
  set: value => applyToUrl({ trade_collection: String(value) }),
})

const applyToUrl = (queryCondition: Record<string, string>) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
