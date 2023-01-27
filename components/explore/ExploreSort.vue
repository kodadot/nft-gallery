<template>
  <div>
    <o-dropdown
      v-model="selectedSort"
      class="sort"
      :close-on-click="false"
      multiple
      aria-role="list"
      @change="onChange">
      <template #trigger>
        <NeoButton type="button" icon="caret-down">Sort By</NeoButton>
        <div v-if="selectedSort.length" class="sort-count">
          {{ selectedSort.length }}
        </div>
      </template>

      <NeoDropdownItem
        v-for="option in options"
        :key="option"
        aria-role="listitem"
        :value="option">
        <span>{{ $i18n.t(`sort.${option}`) }}</span>
      </NeoDropdownItem>
    </o-dropdown>
  </div>
</template>

<script setup lang="ts">
import { isArray } from 'lodash'
import { ODropdown } from '@oruga-ui/oruga'
import { NeoButton, NeoDropdownItem } from '@kodadot1/brick'

import { NFT_SQUID_SORT_CONDITION_LIST } from '@/utils/constants'

const route = useRoute()
const router = useRouter()
const { $i18n } = useNuxtApp()

const options = NFT_SQUID_SORT_CONDITION_LIST

function selectiveSort(options) {
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
  get() {
    return sortOptions.value
  },
  set(value) {
    sortOptions.value = selectiveSort(value)
  },
})

function onChange(selected) {
  router.push({
    query: {
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
@import '@/styles/abstracts/theme';

.sort {
  position: relative;

  .is-neo {
    width: 10rem;
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
      background-color: theme('k-accent');
      border: 1px solid theme('text-color');
    }
  }
}
</style>
