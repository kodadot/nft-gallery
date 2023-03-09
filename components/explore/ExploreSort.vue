<template>
  <div>
    <o-dropdown
      v-model="selectedSort"
      class="sort"
      :close-on-click="false"
      multiple
      :mobile-modal="false"
      aria-role="list"
      :class="{ 'sort-active': isActive }"
      position="bottom-left"
      @change="onChange"
      @active-change="isActive = $event">
      <template #trigger>
        <NeoButton
          type="button"
          :icon="isActive ? 'chevron-up' : 'chevron-down'"
          class="has-text-left is-hidden-mobile"
          data-cy="explore-sort">
          Sort By
        </NeoButton>
        <NeoButton
          type="button"
          icon="filter"
          class="is-hidden-tablet"
          data-cy="explore-sort" />

        <ActiveCount v-if="selectedSort.length" :count="selectedSort.length" />
      </template>

      <NeoDropdownItem
        v-for="option in options"
        :key="option"
        aria-role="listitem"
        class="is-flex"
        :value="option">
        <span>
          {{
            $i18n.t(isItems ? `sort.${option}` : `sort.collection.${option}`)
          }}
        </span>
        <b-icon v-if="selectedSort.includes(option)" icon="check" />
      </NeoDropdownItem>
    </o-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ODropdown } from '@oruga-ui/oruga'
import { NeoButton, NeoDropdownItem } from '@kodadot1/brick'

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

function enforceArray(options: string[]) {
  return Array.isArray(options) ? options : []
}

const sortOptions = ref<string[]>([])
const selectedSort = computed({
  get: () => sortOptions.value,
  set: (value) => (sortOptions.value = enforceArray(value)),
})

function onChange(selected) {
  router.push({
    path: route.fullPath,
    query: {
      ...route.query,
      page: '1',
      sort: enforceArray(selected),
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

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.sort {
  position: relative;

  &-active .is-neo {
    @include ktheme() {
      background-color: theme('text-color');
      color: theme('text-color-inverse');
    }
  }

  .neo-dropdown-item {
    width: 14rem;
  }
}

.dark-mode .sort-check {
  filter: brightness(0%);
}
</style>
