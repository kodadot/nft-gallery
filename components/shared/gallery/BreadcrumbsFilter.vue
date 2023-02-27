<template>
  <b-field grouped group-multiline class="filters-tag">
    <template v-if="true">
      <template v-for="(value, key) in breads">
        <div v-if="value === 'true'" :key="key" class="control">
          <!-- NeoTag -->
          <NeoTag @close="closeTag(String(key))">
            {{ queryMapTranslation[String(key)] }}
          </NeoTag>
        </div>
        <div
          v-if="key === 'search' && value != undefined"
          :key="key"
          class="control">
          <NeoTag @close="removeSearch">
            {{ `${$i18n.t('general.search')}: ${value}` }}
          </NeoTag>
        </div>
      </template>
      <div
        v-if="isAnyFilterActive"
        class="control py-1 is-clickable"
        @click="clearAllFilters">
        <span>{{ $t('sort.clearAll') }}</span>
      </div>
    </template>
  </b-field>
</template>

<script lang="ts" setup>
import useReplaceUrl from '@/components/explore/filters/useReplaceUrl'
import NeoTag from './NeoTag.vue'

const route = useRoute()
const { replaceUrl } = useReplaceUrl()
const { $i18n } = useNuxtApp()

const breads = computed(() => {
  const filters = { ...route.query }
  delete filters.redesign
  return filters
})

const isAnyFilterActive = computed(
  () =>
    Boolean(breads.value?.search) ||
    Object.values(breads.value).includes('true')
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
