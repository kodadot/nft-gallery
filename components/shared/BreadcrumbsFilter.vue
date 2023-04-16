<template>
  <b-field grouped group-multiline class="filters-tag">
    <template v-for="(value, key) in breads">
      <NeoTag
        v-if="key === 'search'"
        :key="key"
        class="control"
        @close="removeBread('search')">
        {{ `${$t('general.search')}: ${value}` }}
      </NeoTag>
      <NeoTag
        v-else-if="key === 'min'"
        :key="key"
        class="control"
        @close="removeBread('min')">
        {{ `${$t('Min')}:` }}
        <CommonTokenMoney :value="value" />
      </NeoTag>
      <NeoTag
        v-else-if="key === 'max'"
        :key="key"
        class="control"
        @close="removeBread('max')">
        {{ `${$t('Max')}:` }}
        <CommonTokenMoney :value="value" />
      </NeoTag>
      <template v-else-if="key === 'collection'">
        <NeoTag
          v-for="item in collections"
          :key="`${key}-${item.id}`"
          class="control"
          @close="removeCollection(item.id)">
          {{ item.meta.name }}
        </NeoTag>
      </template>

      <NeoTag
        v-else
        :key="key"
        class="control d"
        @close="closeTag(String(key))">
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
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import {
  Collection,
  collectionArray,
} from '@/components/shared/filters/modules/usePopularCollections'
import useActiveRouterFilters from '@/composables/useActiveRouterFilters'

const route = useRoute()
const isCollectionActivityTab = computed(
  () => route.name === 'prefix-collection-id-activity'
)
const { replaceUrl } = useReplaceUrl({
  resetPage: !isCollectionActivityTab.value,
})
const { $i18n } = useNuxtApp()
const isItemsExplore = computed(() => route.path.includes('/explore/items'))

const breads = useActiveRouterFilters()

const collections = ref<Collection[]>([])

watch([collectionArray, breads], () => {
  if (breads.value.collection && collectionArray.value?.length > 0) {
    collections.value = breads.value.collection
      .split(',')
      .map((id) => collectionArray.value.find((x) => x.id === id))
      .filter((x) => x?.id) as Collection[]
  }
})

const removeCollection = (id: string) => {
  const ids = collections.value.filter((x) => x.id !== id).map((x) => x.id)
  replaceUrl({ collection: ids.join(',') })
}

const isAnyFilterActive = computed(() =>
  Boolean(Object.keys(breads.value).length)
)

const clearAllFilters = () => {
  const clearedFilters = Object.keys(breads.value).reduce((filters, key) => {
    if (['search', 'min', 'max'].includes(key)) {
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

const removeBread = (key: string) => {
  replaceUrl({ [key]: undefined })
}
</script>

<style lang="scss">
.filters-tag .tag {
  color: initial;
}
</style>
