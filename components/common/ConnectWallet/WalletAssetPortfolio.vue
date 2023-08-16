<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <div>
      <NeoButton
        v-if="isBasilisk"
        v-safe-href="`/${urlPrefix}/assets`"
        no-shadow
        rounded
        tag="a"
        icon="arrow-right-long">
        Portfolio View
      </NeoButton>
    </div>

    <a class="has-text-grey is-size-7" @click="showRampSDK">+ Add Funds</a>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

const { urlPrefix } = usePrefix()
const { isBasilisk } = useIsChain(urlPrefix)
const { accountId } = useAuth()

const showRampSDK = () => {
  new RampInstantSDK({
    defaultAsset: 'KSM',
    userAddress: accountId.value,
    hostAppName: 'KodaDot',
    hostApiKey: 'a99bfvomhhbvzy6thaycxbawz7d3pssuz2a8hsrc', // env
    hostLogoUrl: 'https://kodadot.xyz/apple-touch-icon.png',
    variant: 'desktop',
  }).show()
}
</script>

<style scoped></style>
