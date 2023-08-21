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
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS } from '@kodadot1/static'

const route = useRoute()
const router = useRouter()
const { accountId } = useAuth()

const { setUrlPrefix } = usePrefix()
const { availableChains } = useChain()

const getAddress = (chain: string) => {
  const publicKey = decodeAddress(accountId.value)

  return encodeAddress(publicKey, CHAINS[chain].ss58Format)
}

const selected = computed(() =>
  availableChains.value.find((chain) => chain.value === route.params.prefix)
)

function onSwitchChain(chain) {
  setUrlPrefix(chain)
  const { ...restQuery } = route.query
  router.push({
    params: {
      prefix: chain,
      id: getAddress(chain),
    },
    query: {
      ...restQuery,
      collections: null,
    },
  })
}
</script>
