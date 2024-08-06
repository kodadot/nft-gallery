<template>
  <div class="!mt-6 h-full">
    <NeoButton
      variant="primary"
      no-shadow
      :loading="isConnecting"
      :disabled="isConnecting"
      loading-with-label
      size="large"
      class="w-full"
      @click="modal?.open()"
    >
      <div class="inline-flex gap-3">
        <span>
          {{ isConnecting ? 'Connecting' : 'Connect with Web3Modal' }}
        </span>
        <NeoIcon
          v-if="!isConnecting"
          icon="arrow-right"
        />
      </div>
    </NeoButton>
  </div>
</template>

<script lang="ts" setup>
import { NeoButton, NeoIcon } from '@kodadot1/brick'

const emits = defineEmits(['select'])

const { address, isConnected, isConnecting, chainId } = useWagmi()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { modal } = useWeb3Modal()

watchEffect(() => {
  const chainPrefix = CHAIN_ID_TO_PREFIX?.[chainId.value ?? '']

  if (address.value && isConnected.value && chainId.value && chainPrefix) {
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
