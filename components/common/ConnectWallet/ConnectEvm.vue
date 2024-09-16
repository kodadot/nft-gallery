<template>
  <div class="!mt-6 h-full">
    <NeoButton
      variant="primary"
      no-shadow
      :loading="loading"
      :disabled="loading"
      :loading-with-label="isConnecting"
      size="large"
      class="w-full"
      @click="modal?.open()"
    >
      <div class="inline-flex gap-3">
        <span>
          {{ isConnecting ? 'Connecting' : 'Connect with Web3Modal' }}
        </span>
        <NeoIcon
          v-if="!loading"
          icon="arrow-right"
        />
      </div>
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { useAccount, useDisconnect, useConnections } from '@wagmi/vue'

const emits = defineEmits(['select'])

const { address, isConnected, isConnecting, chainId } = useAccount()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { modal } = useWeb3Modal()
const { disconnectAsync: disconnect } = useDisconnect()
const connections = useConnections()

const disconnecting = ref(false)
const loading = computed(() => isConnecting.value || disconnecting.value)

if (connections.value.length) {
  disconnecting.value = true
  disconnect().finally(() => disconnecting.value = false)
}

watch([address, isConnected, chainId], ([address, isConnected, chainId]) => {
  const chainPrefix = CHAIN_ID_TO_PREFIX?.[chainId ?? '']

  if (address && isConnected && chainId && chainPrefix) {
    const isCorrectChainConnected = chainPrefix === urlPrefix.value

    if (!isCorrectChainConnected) {
      setUrlPrefix(chainPrefix)
    }

    emits('select', {
      address: address as string,
      vm: 'EVM',
    })
  }
})
</script>
