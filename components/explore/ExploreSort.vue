<template>
  <div>
    <NeoDropdown
      v-model="selectedSort"
      class="sort"
      :close-on-click="false"
      multiple
      :mobile-modal="false"
      aria-role="list"
      position="bottom-right"
      data-testid="explore-sort-dropdown"
      @change="onChange"
    >
      <template #trigger="{ active }">
        <NeoButton
          :active="active"
          type="button"
          :icon="active ? 'chevron-up' : 'chevron-down'"
          class="text-left is-hidden-mobile"
        >
          {{ $i18n.t('sort.collection.sortBy') }}
        </NeoButton>
        <NeoButton
          type="button"
          icon="filter"
          class="is-hidden-tablet"
        />

        <ActiveCount
          v-if="selectedSort.length"
          :count="selectedSort.length"
        />
      </template>

      <NeoDropdownItem
        v-for="option in options"
        :key="option"
        aria-role="listitem"
        class="flex"
        :data-testid="option"
        :value="option"
      >
        <span class="inline-flex items-center">
          <span>
            {{
              $i18n.t(isItems ? `sort.${option}` : `sort.collection.${option}`)
            }}
          </span>
          <KIcon
            v-if="selectedSort.includes(option)"
            class="ml-2"
            name="i-mdi:check-circle-outline"
          />
        </span>
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
} from '@kodadot1/brick'
import ActiveCount from './ActiveCount.vue'

const route = useRoute()
const router = useRouter()
const { $i18n } = useNuxtApp()

const { hasItems: isItems } = useHasRoute()
const { options } = useRouteSortByOptions()

function removeDuplicateSortKeys(options: string[]) {
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
  set: value => (sortOptions.value = removeDuplicateSortKeys(value)),
})

function onChange(selected) {
  const { page, ...restQuery } = route.query
  router.push({
    path: route.fullPath,
    query: {
      ...restQuery,
      sort: removeDuplicateSortKeys(selected),
    },
  })
}

watch(
  () => route.query.sort,
  (sort) => {
    if (sort?.length) {
      selectedSort.value = parseQueryParamToArray(sort)
    }
    else if (selectedSort.value.length) {
      selectedSort.value = []
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.sort {
  position: relative;

  &-active .is-neo {
    background-color: var(--text-color);
    color: var(--text-color-inverse);
  }

  .neo-dropdown-item {
    width: 14rem;
  }
}

.dark .sort-check {
  filter: brightness(0%);
}
</style>
