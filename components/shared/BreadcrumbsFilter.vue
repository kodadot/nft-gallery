<template>
  <b-field grouped group-multiline class="filters-tag">
    <template v-for="(value, key) in breads">
      <NeoTag
        v-if="key === 'search'"
        :key="key"
        class="control"
        @close="removeSearch">
        {{ `${$t('general.search')}: ${value}` }}
      </NeoTag>
      <NeoTag v-else :key="key" class="control" @close="closeTag(String(key))">
        {{ queryMapTranslation[String(key)] }}
      </NeoTag>
    </template>
    <div
      v-if="isAnyFilterActive"
      class="control py-1 is-clickable"
      @click="clearAllFilters">
      <span>{{ $t('sort.clearAll') }}</span>
    </div>
  </b-field>
</template>

<script lang="ts" setup>
import NeoTag from '@/components/shared/gallery/NeoTag.vue'

const route = useRoute()
const isCollectionActivityTab = computed(
  () => route.name === 'prefix-collection-id-activity'
)
const { replaceUrl } = useReplaceUrl({
  resetPage: !isCollectionActivityTab.value,
})
const { $i18n } = useNuxtApp()
const isItemsExplore = computed(() => route.path.includes('/explore/items'))

const breads = computed(() => {
  const query = { ...route.query, redesign: undefined }

  const activeFilters = Object.entries(query).filter(
    ([key, value]) => (key === 'search' && Boolean(value)) || value === 'true'
  )
  return Object.fromEntries(activeFilters)
})

const isAnyFilterActive = computed(() =>
  Boolean(Object.keys(breads.value).length)
)

const clearAllFilters = () => {
  const clearedFilters = Object.keys(breads.value).reduce((filters, key) => {
    if (key === 'search') {
      return { ...filters, [key]: undefined }
    }
    return { ...filters, [key]: isCollectionActivityTab ? undefined : 'false' }
  }, {})

  replaceUrl(clearedFilters)
}

const queryMapTranslation = {
  listed: $i18n.t('sort.listed'),
  owned: $i18n.t('sort.own'),
  sale: $i18n.t('filters.sale'),
  offer: $i18n.t('filters.offer'),
  listing: $i18n.t('filters.listing'),
  mint: $i18n.t('filters.mint'),
  transfer: $i18n.t('filters.transfer'),
}

onMounted(() => {
  if (isItemsExplore.value && route.query.listed == undefined) {
    replaceUrl({ listed: 'true' })
  }
})

const closeTag = (key: string) => {
  replaceUrl({ [key]: false })
}

const removeSearch = () => {
  replaceUrl({ search: undefined })
}
</script>

<style lang="scss">
.filters-tag .tag {
  color: initial;
}
</style>
