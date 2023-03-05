<template>
  <div>
    <NeoDropdown
      :v-model="selectedSort"
      :append-to-body="true"
      :multiple="true"
      :close-on-click="false"
      :mobile-modal="false"
      @change="onChange"
      @active-change="isActive = $event">
      <NeoButton
        type="button"
        :icon="isActive ? 'caret-up' : 'caret-down'"
        class="has-text-left is-hidden-mobile"
        data-cy="explore-sort">
        Sort By
      </NeoButton>
      <NeoButton
        type="button"
        icon="filter"
        class="is-hidden-tablet"
        data-cy="explore-sort" />

      <ActiveCount :count="selectedSort.length" />
      <template #items>
        <NeoDropdownItem
          v-for="option in options"
          :key="option"
          aria-role="listitem"
          :value="option">
          <span>
            {{
              $i18n.t(isItems ? `sort.${option}` : `sort.collection.${option}`)
            }}
          </span>
          <img
            v-if="selectedSort.includes(option)"
            class="sort-check"
            src="/checkmark.svg" />
        </NeoDropdownItem>
      </template>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'

import {
  NFT_SQUID_SORT_COLLECTIONS,
  NFT_SQUID_SORT_CONDITION_LIST,
} from '@/utils/constants'
import ActiveCount from './ActiveCount.vue'

const route = useRoute()
const router = useRouter()
const { $i18n } = useNuxtApp()

const isActive = ref(false)
const isItems = computed(() => route.path.includes('items'))
const options = computed(() => {
  return isItems.value
    ? NFT_SQUID_SORT_CONDITION_LIST
    : NFT_SQUID_SORT_COLLECTIONS
})

function selectiveSort(options: string[]) {
  const uniqueOptions = {}

  if (!Array.isArray(options)) {
    return []
  }

  options.forEach((option) => {
    const opt = option.split('_')
    const identifier = opt[0]
    const sort = opt[1]

    uniqueOptions[identifier] = sort
  })

  return Object.keys(uniqueOptions).map((identifier) => {
    return `${identifier}_${uniqueOptions[identifier]}`
  })
}

const sortOptions = ref<string[]>([])
const selectedSort = computed({
  get: () => sortOptions.value,
  set: (value) => (sortOptions.value = selectiveSort(value)),
})

function onChange(selected) {
  router.push({
    path: route.fullPath,
    query: {
      ...route.query,
      page: '1',
      sort: selectiveSort(selected),
    },
  })
}

watch(
  () => route.query.sort,
  (sort) => {
    selectedSort.value = sort as string[]
  }
)

onMounted(() => {
  const sort = route.query.sort

  if (sort?.length) {
    if (Array.isArray(sort)) {
      selectedSort.value = sort as string[]
    } else {
      selectedSort.value = [sort] as string[]
    }
  }
})
</script>
