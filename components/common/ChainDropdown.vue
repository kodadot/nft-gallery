<template>
  <div>
    <NeoDropdown>
      <template #trigger="{ active }">
        <NeoButton
          class="chain-dropdown-text"
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
const { setUrlPrefix } = usePrefix()
const { availableChains } = useChain()
const { redirectAfterChainChange } = useChainRedirect()

const selected = computed(() =>
  availableChains.value.find((chain) => chain.value === route.params.prefix),
)

function onSwitchChain(chain) {
  setUrlPrefix(chain)
  redirectAfterChainChange(chain)
}
</script>

<style lang="scss">
@media screen and (max-width: 768px) {
  .chain-dropdown-text {
    .o-btn__label {
      width: 10.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
