<template>
  <div>
    <NeoDropdown>
      <template #trigger="{ active }">
        <NeoButton
          :label="`Network: ${selected?.text}`"
          :icon="active ? 'chevron-up' : 'chevron-down'"
          :active="active" />
      </template>

      <NeoDropdownItem
        v-for="chain in availableChains"
        :key="chain.value"
        :active="route.params.prefix === chain.value"
        @click="onSwitchChain(chain.value)">
        {{ chain.text }}
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'

const route = useRoute()
const router = useRouter()
const { setUrlPrefix } = usePrefix()
const { availableChains } = useChain()

const selected = computed(() =>
  availableChains.value.find((chain) => chain.value === route.params.prefix)
)

function onSwitchChain(chain) {
  setUrlPrefix(chain)
  const { ...restQuery } = route.query
  router.push({
    params: {
      prefix: chain,
    },
    query: {
      ...restQuery,
      collections: null,
    },
  })
}
</script>
