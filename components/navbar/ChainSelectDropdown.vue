<template>
  <NeoDropdown
    v-model="selected"
    aria-role="list"
    :triggers="['click']"
    position="bottom-left">
    <template #trigger>
      <div class="navbar-item" data-cy="chain">{{ chainName }}</div>
    </template>

    <NeoDropdownItem
      v-for="option in availableChains"
      :key="option.value"
      class="has-text-centered"
      aria-role="listitem"
      :value="option.value"
      :class="{ 'is-active': selected === option.value }"
      :data-cy="`chain-dropdown-${option.value}`">
      {{ option.text }}
    </NeoDropdownItem>
  </NeoDropdown>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { getChainNameByPrefix } from '@/utils/chain'
import { explorerVisible } from '@/utils/config/permision.config'

const { availableChains } = useChain()
const { urlPrefix, setUrlPrefix } = usePrefix()
const prefrencesStore = usePreferencesStore()

const route = useRoute()
const isExplorePage = computed(() => route.name?.includes('prefix-explore'))
const isExplorePageAvailable = (chain: string): boolean =>
  explorerVisible(chain)

const selected = computed({
  get: () => urlPrefix.value,
  set: (value) => {
    prefrencesStore.setNotificationBoxCollapse(false)
    setUrlPrefix(value)

    let newPath = `/${value}`
    if (isExplorePage.value && isExplorePageAvailable(value)) {
      newPath = route.path.replace(urlPrefix.value, value)
    }

    navigateTo(newPath)
  },
})

const chainName = computed(() => getChainNameByPrefix(selected.value))
</script>
