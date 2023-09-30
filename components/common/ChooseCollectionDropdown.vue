<template>
  <NeoDropdown
    required
    :class="[
      'dropdown-width',
      {
        'full-width': fullWidth,
        'no-shadow': noShadow,
      },
    ]"
    :no-shadow="noShadow"
    :disabled="!isLogIn">
    <template #trigger="{ active }">
      <NeoButton
        v-if="!selectedCollection"
        class="dropdown-width"
        :no-shadow="noShadow"
        :label="$t('massmint.selectCollection')"
        :icon="active ? 'chevron-up' : 'chevron-down'" />
      <NeoButton
        v-else
        class="dropdown-width"
        :no-shadow="noShadow"
        :icon="active ? 'chevron-up' : 'chevron-down'">
        {{ selectedCollection.name || selectedCollection.id }}
        <NeoIcon
          v-if="selectedCollection"
          icon="circle-check"
          variant="success"
          class="ml-3" />
      </NeoButton>
    </template>

    <template v-if="collectionsEntites?.length">
      <NeoDropdownItem
        v-for="collection in collectionsEntites"
        :key="collection.id"
        class="dropdown-width"
        @click="selectCollection(collection)">
        {{ collection.name || collection.id }} - ({{ collection.totalCount }})
      </NeoDropdownItem>
      <NeoDropdownItem class="dropdown-width">
        <nuxt-link to="/create/collection" class="w-full">
          <div class="w-full">
            <NeoIcon icon="plus" class="mr-1" />
            {{ $t('massmint.createNewCollection') }}
          </div>
        </nuxt-link>
      </NeoDropdownItem>
    </template>
    <template v-else>
      <NeoDropdownItem disabled class="dropdown-width">
        {{ $t('massmint.noCollection') }}
      </NeoDropdownItem>
      <NeoDropdownItem class="dropdown-width">
        <nuxt-link to="/create/collection" class="w-full">
          <div class="w-full">
            <NeoIcon icon="plus" class="mr-1" />
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
  NeoIcon,
} from '@kodadot1/brick'
import { MintedCollection } from '@/composables/transaction/types'
import { useCollectionForMint } from '@/composables/massmint/useMassMint'

defineProps({
  fullWidth: { type: Boolean, default: false },
  noShadow: { type: Boolean, default: false },
})

const { isLogIn, accountId } = useAuth()

const { collectionsEntites } = useCollectionForMint()
const selectedCollection = ref<MintedCollection>()
const emit = defineEmits(['selectedCollection'])

watch(accountId, () => {
  selectedCollection.value = undefined
})

const selectCollection = (collection) => {
  selectedCollection.value = collection
  emit('selectedCollection', collection)
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.dropdown-width {
  width: 30rem;
}

.full-width {
  width: 100%;
  .dropdown-width,
  :deep(.o-drop__menu) {
    width: 100%;
  }
}

@include mobile {
  .dropdown-width {
    width: 100%;
  }

  .mobile-width {
    min-width: 6rem;
  }
}
</style>
