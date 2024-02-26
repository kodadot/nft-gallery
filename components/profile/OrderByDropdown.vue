<template>
  <div>
    <NeoDropdown
      v-model="selectedSort"
      class="sort"
      :close-on-click="false"
      multiple
      :mobile-modal="false"
      aria-role="list"
      position="bottom-auto"
      @change="onChange">
      <template #trigger="{ active }">
        <NeoButton
          :active="active"
          type="button"
          :no-shadow="noShadow"
          :rounded="rounded"
          :icon="active ? 'chevron-up' : 'chevron-down'"
          class="text-left"
          data-testid="explore-sort">
          {{ $i18n.t('sort.collection.sortBy') }}
        </NeoButton>

        <ActiveCount v-if="selectedSort.length" :count="selectedSort.length" />
      </template>

      <NeoDropdownItem
        v-for="option in options"
        :key="option"
        aria-role="listitem"
        class="flex"
        :data-testid="option"
        :value="option">
        <span>
          {{
            $i18n.t(
              !isCollectionsTab
                ? `sort.${option}`
                : `sort.collection.${option}`,
            )
          }}
        </span>
        <NeoIcon
          v-if="selectedSort.includes(option)"
          class="ml-2"
          icon="check" />
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoIcon,
} from '@kodadot1/brick'
import {
  NFT_SQUID_SORT_COLLECTIONS,
  NFT_SQUID_SORT_CONDITION_LIST,
} from '@/utils/constants'
import ActiveCount from '@/components/explore/ActiveCount.vue'

const props = withDefaults(
  defineProps<{
    preselect?: string | null
    noShadow: boolean
    rounded: boolean
  }>(),
  {
    noShadow: false,
    rounded: false,
    preselect: null,
  },
)

const route = useRoute()
const router = useRouter()
const { $i18n } = useNuxtApp()

const isCollectionsTab = computed(
  () => (route.query.tab as string) === 'collections',
)

const options = computed(() => {
  return isCollectionsTab.value
    ? NFT_SQUID_SORT_COLLECTIONS
    : NFT_SQUID_SORT_CONDITION_LIST
})

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
  set: (value) => (sortOptions.value = removeDuplicateSortKeys(value)),
})

function onChange(selected) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    selectedSort.value = sort as string[]
  },
)

onMounted(() => {
  const sort = route.query.sort

  if (props.preselect) {
    selectedSort.value = [props.preselect]
  }

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
@import '@/assets/styles/abstracts/variables';

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

.dark .sort-check {
  filter: brightness(0%);
}
</style>
