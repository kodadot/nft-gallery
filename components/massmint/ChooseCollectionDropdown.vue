<template>
  <NeoDropdown
    class="dropdown-width"
    :disabled="!isLogIn"
    @active-change="toggleOpen">
    <NeoButton
      v-if="!selectedCollection"
      class="dropdown-width"
      :label="$t('massmint.selectCollection')"
      :icon="isDropdownopen ? 'chevron-up' : 'chevron-down'" />
    <NeoButton
      v-else
      class="dropdown-width"
      :icon="isDropdownopen ? 'chevron-up' : 'chevron-down'">
      {{ selectedCollection.name || selectedCollection.id }}
      <NeoIcon
        v-if="selectedCollection"
        icon="circle-check"
        size="small"
        variant="success"
        class="ml-3" />
    </NeoButton>
    <template v-if="collectionsEntites?.length" #items>
      <NeoDropdownItem
        v-for="collection in collectionsEntites"
        :key="collection.id"
        class="dropdown-width"
        @click.native="selectCollection(collection)">
        {{ collection.name || collection.id }}
      </NeoDropdownItem>
      <NeoDropdownItem class="dropdown-width" has-link>
        <nuxt-link :to="`/${urlPrefix}/create`" class="w-100">
          <div class="w-full">
            <NeoIcon icon="plus" size="small" class="mr-1" />
            {{ $t('massmint.createNewCollection') }}
          </div>
        </nuxt-link>
      </NeoDropdownItem>
    </template>
    <template v-else #items>
      <NeoDropdownItem disabled class="dropdown-width">
        {{ $t('massmint.noCollection') }}
      </NeoDropdownItem>
      <NeoDropdownItem class="dropdown-width">
        <div class="w-full">
          <NeoIcon icon="plus" size="small" class="mr-1" />
          {{ $t('massmint.createNewCollection') }}
        </div>
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
import { MintedCollection, useMassMint } from './useMassMint'

const { urlPrefix } = usePrefix()
const { isLogIn, accountId } = useAuth()

const { collectionsEntites } = useMassMint()
const isDropdownopen = ref(false)
const selectedCollection = ref<MintedCollection>()
const emit = defineEmits(['selectedCollection'])

watch(accountId, () => {
  selectedCollection.value = undefined
})

const toggleOpen = () => {
  isDropdownopen.value = !isDropdownopen.value
}
const selectCollection = (collection) => {
  selectedCollection.value = collection
  emit('selectedCollection', collection)
}
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.dropdown-width {
  width: 30rem;
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
