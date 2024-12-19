<template>
  <NeoDropdown
    v-model="checked"
    :disabled="isDisabled"
    :scrollable="collections.length > 4"
    class="py-0"
    :mobile-modal="true"
    :close-on-click="false"
    multiple
  >
    <template #trigger="{ active }">
      <NeoButton
        :active="active"
        no-shadow
        :variant="variant"
        label="Collections"
        :icon="active ? 'chevron-up' : 'chevron-down'"
      />

      <ActiveCount
        :count="checked.length"
        position="top-right"
      />
    </template>

    <div class="py-5 dropdown-width">
      <NeoDropdownItem
        v-for="collection in collections"
        :key="collection.id"
        class="!flex border-none items-center"
        aria-role="listitem"
        :value="collection.id"
      >
        <NeoCheckbox
          :model-value="isSelected(collection)"
          class="pointer-events-none"
        />
        <div class="flex items-center filter-container grow min-w-0">
          <img
            :src="sanitizeIpfsUrl(collection.meta?.image)"
            class="image is-32x32 is-flex-shrink-0 border mr-2"
            :alt="collection.name || collection.id"
          >
          <div class="flex flex-col grow min-w-0">
            <div class="is-ellipsis">
              {{ collection.name || collection.id }}
            </div>

            <div class="flex justify-between text-xs text-k-grey">
              <div>{{ $t('search.owners') }}: {{ collection.ownerCount }}</div>
            </div>
          </div>

          <div class="rounded-2xl ml-5 px-3 bg-k-grey-light">
            {{ collection.ownedCount }}
          </div>
        </div>
      </NeoDropdownItem>
    </div>
  </NeoDropdown>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoCheckbox,
  NeoDropdown,
  NeoDropdownItem,
  type NeoButtonVariant,
} from '@kodadot1/brick'
import isEqual from 'lodash/isEqual'
import ActiveCount from '../explore/ActiveCount.vue'
import collectionListWithSearchMinimal from '@/queries/subsquid/general/collectionListWithSearchMinimal.graphql'
import type { CollectionEntityMinimal } from '@/components/collection/utils/types'
import { getDenyList } from '@/utils/prefix'

type Collection = CollectionEntityMinimal & {
  ownedCount: number
}

const props = defineProps<{
  id: string
  modelValue: string[]
  search: Record<string, string | number>
  variant: NeoButtonVariant
}>()

const isLoading = ref(false)
const checked = useVModel(props, 'modelValue')

const { urlPrefix, client } = usePrefix()

const collections = ref<Collection[]>([])

const isDisabled = computed(
  () => collections.value.length === 0 || isLoading.value,
)

const nonCollectionSearchParams = computed(() => {
  const search = { ...props.search }
  delete search.collection
  return search
})

const getProfileCollections = async () => {
  const collectionSearch = {
    nfts_some: nonCollectionSearchParams.value,
  }

  isLoading.value = true

  const { data } = await useAsyncQuery<{ collectionEntities: CollectionEntityMinimal[] }>({
    query: collectionListWithSearchMinimal,
    variables: {
      search: [collectionSearch],
      denyList: getDenyList(urlPrefix.value),
      first: 100,
      offset: 0,
    },
    clientId: client.value,
    cache: true,
  })

  const collectionEntities = data.value?.collectionEntities || []

  collections.value = await formatCollections(collectionEntities)

  syncCheckedCollections()

  isLoading.value = false
}

const formatCollections = (collections) => {
  return Promise.all(
    collections.map(async (collection) => {
      const ownedCount = await getNftCount({
        currentOwner_eq: props.id,
        collection: { id_eq: collection.id },
      })

      return {
        ...collection,
        ownedCount,
      } as Collection
    }),
  )
}

const isSelected = (collection: Collection) => {
  return checked.value.includes(collection.id)
}

const syncCheckedCollections = () => {
  const filteredChecked = collections.value
    .map(c => c.id)
    .filter(id => checked.value.includes(id))

  if (isEqual(checked.value, filteredChecked)) {
    return
  }

  checked.value = filteredChecked
}

watch(
  nonCollectionSearchParams,
  async (search, prevSearch) => {
    if (!isEqual(search, prevSearch)) {
      await getProfileCollections()
    }
  },
  { deep: true },
)

useLazyAsyncData('profileCollections', async () => {
  await getProfileCollections()
})
</script>
