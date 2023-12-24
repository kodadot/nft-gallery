<template>
  <section class="section has-text-centered">
    <div class="title is-4">
      {{ $t('profile.searchNoResultsTitle') }}
    </div>
    <div class="subtitle is-6">
      {{ $t('profile.searchNoResultsText', [totalChainsLength - 1]) }}
    </div>
    <NeoButton
      variant="pill"
      :label="$t('profile.searchNoResultsButton', [nextPrefix.toUpperCase()])"
      @click="switchToPrefix(nextPrefix)" />
  </section>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import type { Prefix } from '@kodadot1/static'

const { redirectAfterChainChange } = useChainRedirect()
const { urlPrefix, setUrlPrefix } = usePrefix()
const { availableChains } = useChain()
const totalChainsLength = computed(() => availableChains.value.length)
const nextPrefix = computed(() => {
  const index = availableChains.value.findIndex(
    (option) => option.value === urlPrefix.value,
  )
  return availableChains.value[(index + 1) % totalChainsLength.value]
    .value as Prefix
})

const switchToPrefix = (targetPrefix: Prefix) => {
  setUrlPrefix(targetPrefix)
  redirectAfterChainChange(targetPrefix)
}
</script>
