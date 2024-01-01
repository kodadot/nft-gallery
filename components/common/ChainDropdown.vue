<template>
  <div>
    <NeoDropdown :position="position">
      <template #trigger="{ active }">
        <NeoButton
          class="chain-dropdown-text"
          :label="
            isMobile || !showNetworkLabel
              ? selected?.text
              : `Network: ${selected?.text}`
          "
          :icon="active ? 'chevron-up' : 'chevron-down'"
          :active="active" />
      </template>

      <NeoDropdownItem
        v-for="chain in availableChains"
        :key="chain.value"
        :active="prefix === chain.value"
        @click="onSwitchChain(chain.value)">
        {{ chain.text }}
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    showNetworkLabel: boolean
    position?: 'bottom-left'
  }>(),
  {
    showNetworkLabel: true,
    position: undefined,
  },
)

const route = useRoute()
const { setUrlPrefix, urlPrefix } = usePrefix()
const { availableChains } = useChain()
const { redirectAfterChainChange } = useChainRedirect()
const { isMobile } = useViewport()

const prefix = computed(() => route.params.prefix || urlPrefix.value)

const selected = computed(() =>
  availableChains.value.find((chain) => chain.value === prefix.value),
)

function onSwitchChain(chain) {
  setUrlPrefix(chain)
  redirectAfterChainChange(chain)
}
</script>
