<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <NeoButton
      no-shadow
      rounded
      tag="nuxt-link"
      size="small"
      :to="`/${urlPrefix}/u/${accountId}`"
      icon="arrow-right-long">
      Portfolio View
    </NeoButton>

    <a class="has-text-grey is-size-7" @click="showRampSDK">+ Add Funds</a>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'

const { urlPrefix } = usePrefix()
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
