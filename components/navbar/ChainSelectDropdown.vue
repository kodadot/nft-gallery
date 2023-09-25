<template>
  <NeoDropdown
    v-model="selected"
    aria-role="list"
    :triggers="['click']"
    position="bottom-left">
    <template #trigger>
      <div class="navbar-item" data-testid="chain">{{ chainName }}</div>
    </template>

    <NeoDropdownItem
      v-for="option in availableChains"
      :key="option.value"
      class="has-text-centered"
      aria-role="listitem"
      :value="option.value"
      :class="{ 'is-active': selected === option.value }"
      :data-testid="`chain-dropdown-${option.value}`">
      {{ option.text }}
    </NeoDropdownItem>
  </NeoDropdown>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { useListingCartStore } from '@/stores/listingCart'
import { getChainNameByPrefix } from '@/utils/chain'

const { availableChains } = useChain()
const { redirectAfterChainChange } = useChainRedirect()
const { urlPrefix, setUrlPrefix } = usePrefix()
const prefrencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()

const selected = computed({
  get: () => urlPrefix.value,
  set: (newChain) => {
    prefrencesStore.setNotificationBoxCollapse(false)
    listingCartStore.clear()
    setUrlPrefix(newChain)
    redirectAfterChainChange(newChain)
  },
})

const chainName = computed(() => getChainNameByPrefix(selected.value))
</script>
