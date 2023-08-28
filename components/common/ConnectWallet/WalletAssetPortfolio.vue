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

const { urlPrefix } = usePrefix()
const { isBasilisk } = useIsChain(urlPrefix)
const { accountId } = useAuth()
const { initRampInstant } = useRamp()

const showRampSDK = () => {
  initRampInstant({
    defaultAsset: 'KSM',
    address: accountId.value,
    url: 'https://app.demo.ramp.network',
  })
}
</script>

<style scoped></style>
