<template>
  <div class="content field-group-container">
    <NeoField grouped group-multiline>
      <Sort
        class="control"
        :value="sortBy"
        :is-collection="true"
        :sort-option="sortOption"
        @input="updateSortBy" />
      <div
        class="flex layout-search"
        :class="{
          'flex-grow ': !hideSearch,
        }">
        <NeoField v-if="!hideSearch" expanded class="control">
          <NeoInput
            v-model="searchQuery"
            placeholder="Search..."
            type="search"
            icon="search"
            expanded
            class="input-search">
          </NeoInput>
        </NeoField>
        <BasicSwitch
          v-if="!isMoonRiver"
          v-model="vListed"
          class="flex control mb-5"
          :label="!replaceBuyNowWithYolo ? 'sort.listed' : 'YOLO'"
          size="is-medium"
          label-color="has-text-success"
          :disabled="disableToggle"
          :message="$t('tooltip.buy')" />
        <BasicSwitch
          v-if="showOwnerSwitch"
          v-model="vOwned"
          class="flex control mb-5"
          :label="'sort.own'"
          size="is-medium"
          label-color="has-text-success"
          :message="$t('tooltip.own')" />
        <slot />
      </div>
    </NeoField>
  </div>
</template>

<script setup lang="ts">
import { exist } from '@/utils/exist'
import { usePreferencesStore } from '@/stores/preferences'
import { NeoField, NeoInput } from '@kodadot1/brick'
import Sort from './SearchSortDropdown.vue'
import BasicSwitch from '@/components/shared/form/BasicSwitch.vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  search: { type: String, default: '' },
  type: { type: String, default: '' },
  sortBy: { type: String, default: 'blockNumber_DESC' },
  listed: { type: Boolean, default: false },
  owned: { type: Boolean, default: false },
  disableToggle: Boolean,
  hideSearch: Boolean,
  isMoonRiver: Boolean,
  showOwnerSwitch: Boolean,
  sortOption: Array as () => string[] | undefined,
})

const emit = defineEmits([
  'update:listed',
  'update:owned',
  'update:type',
  'update:sortBy',
  'update:search',
])

const preferencesStore = usePreferencesStore()
const { replaceUrl } = useReplaceUrl()

const route = useRoute()

onMounted(() => {
  exist(route.query.search, updateSearch)
  exist(route.query.type, updateType)
  exist(route.query.sortBy, updateSortBy)
  exist(route.query.listed, updateListed)
  exist(route.query.owned, updateOwned)

  useKeyboardEvents({
    f: bindFilterEvents,
  })
})

const bindFilterEvents = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'b':
      updateListed(!vListed.value)
      break
    case 'n':
      updateSortBy(props.sortOption?.[0] || '')
      break
    case 'o':
      updateSortBy(props.sortOption?.[1] || '')
      break
    case 'a':
      updateSortBy(props.sortOption?.[2] || '')
      break
    case 'e':
      updateSortBy(props.sortOption?.[3] || '')
      break
  }
}

const vListed = computed({
  get: () => props.listed,
  set: (value: boolean) => {
    updateListed(value)
  },
})

const vOwned = computed({
  get: () => props.owned,
  set: (value: boolean) => {
    updateOwned(value)
  },
})

const searchQuery = computed({
  get: (): string => props.search,
  set: (value: string) => {
    updateSearch(value)
  },
})

const replaceBuyNowWithYolo = preferencesStore.getReplaceBuyNowWithYolo

const updateListed = useDebounceFn((value: string | boolean) => {
  const queryValue = String(value) === 'true'
  replaceUrl({ listed: queryValue })
  emit('update:listed', queryValue)
}, 50)

const updateOwned = useDebounceFn((value: string | boolean) => {
  const queryValue = value ? String(value) : ''
  replaceUrl({ owned: queryValue })
  emit('update:owned', Boolean(queryValue))
}, 50)

const updateType = useDebounceFn((value: string) => {
  replaceUrl({ type: value })
  emit('update:type', value)
}, 50)

const updateSortBy = useDebounceFn((value: string) => {
  const listed = Boolean(value?.toLowerCase().indexOf('price') > -1)
  if (listed && !vListed.value) {
    vListed.value = true
  }

  replaceUrl({ sort: value })
  emit('update:sortBy', value)
}, 400)

const updateSearch = useDebounceFn((value: string) => {
  if (value !== searchQuery.value) {
    replaceUrl({ search: value })
    emit('update:search', value)
  }
}, 400)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.card {
  box-shadow: 0px 0px 5px 0.5px $primary;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss">
/* cry in scss (global) */
.field-group-container {
  .is-grouped-multiline {
    flex-wrap: initial !important;
    justify-content: space-between;
    .layout-search {
      @media screen and (max-width: 768px) {
        flex-wrap: wrap !important;
        gap: 10px;
      }
    }
    @media screen and (max-width: 768px) {
      flex-wrap: wrap !important;
    }
  }
  .input-search {
    input {
      border: 1px solid #7d7d7d !important;
    }
  }
}
</style>
