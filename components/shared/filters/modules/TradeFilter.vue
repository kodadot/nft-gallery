<template>
  <SiderbarFilterSection
    :title="$t('filters.tradeType', [$t('swap.swap')])"
    :expanded="expanded"
    :fluid-padding="fluidPadding"
  >
    <NeoField>
      <NeoCheckbox
        v-model="entire_collection"
        data-testid="filter-checkbox-buynow"
      >
        {{ $t('filters.tradeCollection', [$t('swaps')]) }}
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

const { replaceUrl: replaceURL } = useReplaceUrl()

const entire_collection = computed({
  get: () => route.query?.trade_collection?.toString() === 'true',
  set: value => applyToUrl({ trade_collection: String(value) }),
})

const applyToUrl = (queryCondition: Record<string, string>) => {
  replaceURL(queryCondition)
  emit('resetPage')
}
</script>
