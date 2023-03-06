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
import useReplaceUrl from '@/components/explore/filters/useReplaceUrl'
import NeoTag from './NeoTag.vue'

const route = useRoute()
const { replaceUrl } = useReplaceUrl()
const { $i18n } = useNuxtApp()

const breads = computed(() => {
  const query = { ...route.query, redesign: undefined }

  const activeFilters = Object.entries(query).filter(
    ([key, value]) =>
(key === 'search' && Boolean(value)) ||
      value === 'true'
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
    return { ...filters, [key]: 'false' }
  }, {})

  replaceUrl(clearedFilters)
}

const queryMapTranslation = {
  listed: $i18n.t('sort.listed'),
  owned: $i18n.t('sort.own'),
}

onMounted(() => {
  if (route.query.listed == undefined) {
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
