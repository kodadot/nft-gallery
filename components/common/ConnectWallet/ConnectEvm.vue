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
        <KIcon
          v-if="!loading"
          name="i-mdi:arrow-right"
        />
      </div>
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { useAccount, useDisconnect, useConnections } from '@wagmi/vue'

const emits = defineEmits(['select'])

const { address, isConnected, isConnecting, chainId } = useAccount()
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
    emits('select', {
      account: {
        address: address as string,
        vm: 'EVM',
      },
      prefix: chainPrefix,
    })
  }
})
</script>
