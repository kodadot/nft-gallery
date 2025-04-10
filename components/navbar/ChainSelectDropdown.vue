<template>
  <NeoDropdown
    v-model="selected"
    aria-role="list"
    :triggers="['click']"
    position="bottom-left"
  >
    <template #trigger>
      <div
        class="navbar-item"
        data-testid="chain"
      >
        {{ chainName }}
      </div>
    </template>

    <NeoDropdownItem
      v-for="option in visibleOptions"
      :key="option.value"
      class="text-center"
      aria-role="listitem"
      :value="option.value"
      :class="{ 'is-active': selected === option.value }"
      :data-testid="`chain-dropdown-${option.value}`"
    >
      {{ option.text }}
    </NeoDropdownItem>
  </NeoDropdown>
</template>

<script lang="ts" setup>
import { NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { getChainNameByPrefix } from '@/utils/chain'

const { redirectAfterChainChange } = useChainRedirect()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { availableChains: options } = useChain()
const route = useRoute()

const isOnCreatePage = computed(() => {
  const path = route.path
  return path.includes('/create') || path.includes('/massmint')
})

const visibleOptions = computed(() =>
  isOnCreatePage.value ? options.value.filter(option => enableCreateChains.includes(String(option.value))) : options.value,
)

const selected = computed({
  get: () => urlPrefix.value,
  set: (newChain) => {
    setUrlPrefix(newChain)
    redirectAfterChainChange(newChain)
  },
})

const chainName = computed(() => getChainNameByPrefix(selected.value))
</script>
