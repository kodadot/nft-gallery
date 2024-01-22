<template>
  <NeoDropdown
    v-model="checked"
    :disabled="isDisabled"
    :y-scrollable="collections.length > 4"
    class="py-0"
    :mobile-modal="true"
    :close-on-click="false"
    multiple>
    <template #trigger="{ active }">
      <NeoButton
        :active="active"
        no-shadow
        rounded
        label="Collections"
        :icon="active ? 'chevron-up' : 'chevron-down'" />

      <ActiveCount :count="checked.length" position="top-right" />
    </template>

    <div class="py-5 dropdown-width">
      <NeoDropdownItem
        v-for="collection in collections"
        :key="collection.id"
        class="is-flex border-0 is-justify-content-center is-align-items-center"
        aria-role="listitem"
        :value="collection.id">
        <NeoCheckbox
          :model-value="isSelected(collection)"
          class="pointer-events-none" />
        <div
          class="is-flex is-align-items-center filter-container is-flex-grow-1 min-width-0">
          <img
            :src="sanitizeIpfsUrl(collection.meta.image)"
            class="image is-32x32 is-flex-shrink-0 border mr-2"
            :alt="collection.name || collection.id" />
          <div
            class="is-flex is-flex-direction-column is-flex-grow-1 min-width-0">
            <div class="is-ellipsis">
              {{ collection.name || collection.id }}
            </div>

            <div
              class="is-flex is-justify-content-space-between text-xs text-k-grey">
              <div>{{ $t('search.owners') }}: {{ collection.owners }}</div>
            </div>
          </div>

          <div class="rounded-2xl ml-5 px-3 bg-k-grey-light">
            {{ collection.owned }}
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
} from '@kodadot1/brick'
import collectionListWithSearch from '@/queries/subsquid/general/collectionListWithSearch.graphql'
import ActiveCount from '../explore/ActiveCount.vue'
import { CollectionEntityMinimal } from '@/components/collection/utils/types'
import { getDenyList } from '@/utils/prefix'
import isEqual from 'lodash/isEqual'

type Collection = CollectionEntityMinimal & {
  owners: number
  owned: number
}

const props = defineProps<{
  id: string
  modelValue: string[]
  search: Record<string, string | number>
  tabKey: string
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

  const { data } = await useAsyncQuery({
    query: collectionListWithSearch,
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

  collections.value = formatCollections(collectionEntities)

  syncCheckedCollections()

  isLoading.value = false
}

const formatCollections = (collectionEntities) => {
  return collectionEntities.map((collection) => {
    const currentOwners = collection.nfts.map((nft) => nft.currentOwner)

    return {
      ...collection,
      owners: new Set(currentOwners).size,
      owned: currentOwners.filter(
        (currentOwner: string) => props.id === currentOwner,
      ).length,
    }
  })
}

const isSelected = (collection: Collection) => {
  return checked.value.includes(collection.id)
}

const syncCheckedCollections = () => {
  const filteredChecked = collections.value
    .map((c) => c.id)
    .filter((id) => checked.value.includes(id))

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

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.dropdown-width {
  width: 18.75rem;

  @include mobile {
    width: unset;
  }
}
</style>
