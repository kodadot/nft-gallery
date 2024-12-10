<template>
  <div>
    <NeoDropdown :position="position">
      <template #trigger="{ active }">
        <NeoButton
          class="chain-dropdown-text"
          :variant
          :label="
            isMobile || !showNetworkLabel
              ? label || selected?.text
              : `Network: ${selected?.text}`
          "
          :icon="active ? 'chevron-up' : 'chevron-down'"
          :active="active"
        />
      </template>

      <NeoDropdownItem
        v-for="chain in availableChains"
        :key="chain.value"
        :active="prefix === chain.value"
        @click="onSwitchChain(chain.value)"
      >
        {{ chain.text }}
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem, type NeoButtonVariant } from '@kodadot1/brick'
import { type Prefix } from '@kodadot1/static'

const props = withDefaults(
  defineProps<{
    showNetworkLabel: boolean
    position?: 'bottom-auto'
    redirect?: boolean
    exclude?: Prefix[]
    variant?: NeoButtonVariant
    label?: string
    filterByVm?: boolean
  }>(),
  {
    showNetworkLabel: true,
    position: undefined,
    redirect: true,
    mobileModal: false,
    exclude: () => [],
    filterByVm: false,
  },
)

const route = useReactiveRoute()
const { setUrlPrefix, urlPrefix } = usePrefix()
const { availableChains: allChains, availableChainsByVm: allChainInVm } = useChain()
const { redirectAfterChainChange } = useChainRedirect()
const { isMobile } = useViewport()

const prefix = computed(() => route.params.prefix || urlPrefix.value)

const selected = computed(() =>
  allChains.value.find(chain => chain.value === prefix.value),
)

const availableChains = computed(() => {
  return (props.filterByVm ? allChainInVm.value : allChains.value)
    .filter(chain => !props.exclude.includes(chain.value as Prefix))
})

function onSwitchChain(chain) {
  setUrlPrefix(chain)
  if (props.redirect) {
    redirectAfterChainChange(chain)
  }
}
</script>
