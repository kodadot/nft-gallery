<template>
  <div>
    <o-dropdown
      v-model="selectedSort"
      class="sort"
      :close-on-click="false"
      multiple
      aria-role="list"
      :class="{ 'sort-active': isActive }"
      :mobile-modal="false"
      @change="onChange"
      @active-change="isActive = $event">
      <template #trigger>
        <NeoButton
          type="button"
          :icon="isActive ? 'caret-up' : 'caret-down'"
          class="has-text-left"
          data-cy="explore-sort">
          Sort By
        </NeoButton>
        <div
          v-if="selectedSort.length"
          class="sort-count is-flex is-justify-content-center is-align-items-center">
          <span>{{ selectedSort.length }}</span>
        </div>
      </template>

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
    </o-dropdown>
  </div>
</template>

<script setup lang="ts">
import { isArray } from 'lodash'
import { ODropdown } from '@oruga-ui/oruga'
import { NeoButton, NeoDropdownItem } from '@kodadot1/brick'

import {
  NFT_SQUID_SORT_COLLECTIONS,
  NFT_SQUID_SORT_CONDITION_LIST,
} from '@/utils/constants'

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

  if (!isArray(options)) {
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
    if (isArray(sort)) {
      selectedSort.value = sort as string[]
    } else {
      selectedSort.value = [sort] as string[]
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
@import '@/styles/abstracts/theme';

.sort {
  position: relative;

  &-active .is-neo {
    @include ktheme() {
      background-color: theme('text-color');
      color: theme('text-color-inverse');
    }
  }

  .neo-dropdown-item {
    width: 16rem;
  }

  &-count {
    position: absolute;
    top: -0.75rem;
    left: -0.75rem;
    height: 1.5rem;
    width: 1.5rem;
    line-height: 1.5rem;
    text-align: center;

    @include ktheme() {
      border: 1px solid theme('border-color');
      background: theme('k-primary');
      color: theme('black');
    }
  }
}

.dark-mode .sort-check {
  filter: brightness(0%);
}
</style>
