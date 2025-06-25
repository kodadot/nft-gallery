<template>
  <NeoDropdown
    :class="[
      'dropdown-width',
      {
        'full-width': fullWidth,
        'no-shadow': noShadow,
      },
    ]"
    :no-shadow="noShadow"
    :disabled="disabled"
    scrollable
  >
    <template #trigger="{ active }">
      <NeoButton
        v-if="!selectedCollection"
        class="dropdown-width"
        :no-shadow="noShadow"
        :label="isLoading ? $t('loading') : $t('massmint.selectCollection')"
        :icon="isLoading ? undefined : (active ? 'chevron-up' : 'chevron-down')"
      />
      <NeoButton
        v-else
        class="dropdown-width"
        :no-shadow="noShadow"
        :icon="active ? 'chevron-up' : 'chevron-down'"
      >
        {{ selectedCollection.name || selectedCollection.id }}
        <KIcon
          v-if="selectedCollection"
          name="i-mdi:check-circle-outline"
          class="ml-3 text-k-green"
        />
      </NeoButton>
    </template>

    <template v-if="collectionsEntites?.length">
      <NeoDropdownItem
        v-for="collection in collectionsEntites"
        :key="collection.id"
        class="dropdown-width"
        @click="selectCollection(collection)"
      >
        {{ collection.name || collection.id }} - ({{ collection.totalCount }})
      </NeoDropdownItem>
      <NeoDropdownItem class="dropdown-width">
        <nuxt-link
          to="/create/collection"
          class="w-full"
        >
          <div class="w-full inline-flex items-center">
            <KIcon
              name="i-mdi:plus"
              class="mr-1"
            />
            {{ $t('massmint.createNewCollection') }}
          </div>
        </nuxt-link>
      </NeoDropdownItem>
    </template>
    <template v-else>
      <NeoDropdownItem
        disabled
        class="dropdown-width"
      >
        {{ $t('massmint.noCollection') }}
      </NeoDropdownItem>
      <NeoDropdownItem class="dropdown-width">
        <nuxt-link
          to="/create/collection"
          class="w-full"
        >
          <div class="w-full inline-flex items-center">
            <KIcon
              name="i-mdi:plus"
              class="mr-1"
            />
            {{ $t('massmint.createNewCollection') }}
          </div>
        </nuxt-link>
      </NeoDropdownItem>
    </template>
  </NeoDropdown>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
} from '@kodadot1/brick'
import type { MintedCollection } from '@/composables/transaction/types'
import { useCollectionForMint } from '@/composables/massmint/useMassMint'

const emit = defineEmits(['selectedCollection'])
const props = defineProps({
  fullWidth: { type: Boolean, default: false },
  noShadow: { type: Boolean, default: false },
  preselected: { type: String, default: undefined },
})

const { isLogIn, accountId } = useAuth()

const { collections: collectionsEntites, isLoading } = useCollectionForMint()
const selectedCollection = ref<MintedCollection>()

const disabled = computed(() => !isLogIn.value || isLoading.value)

const selectCollection = (collection) => {
  selectedCollection.value = collection
  emit('selectedCollection', collection)
}

const handleCollectionsChange = (
  collections: MintedCollection[] | undefined,
) => {
  if (!props.preselected) {
    return
  }

  const collection = [collections]
    .filter(Boolean)
    .flat()
    .find(collection => collection?.id === props.preselected)

  if (collection) {
    selectCollection(collection)
  }
}

watch(accountId, () => {
  selectedCollection.value = undefined
})

watch(collectionsEntites, handleCollectionsChange, { immediate: true })
</script>

<style lang="scss" scoped>
.dropdown-width {
  width: 30rem;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
}

.full-width {
  width: 100%;

  .dropdown-width,
  :deep(.o-drop__menu) {
    width: 100%;
  }
}
</style>
