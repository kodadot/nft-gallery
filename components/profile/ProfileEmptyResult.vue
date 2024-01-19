<template>
  <section class="section text-center">
    <div class="title is-4">
      {{ $t('profile.searchNoResultsTitle') }}
    </div>
    <div v-if="totalChainsLength" class="subtitle is-6">
      {{ $t('profile.searchNoResultsText', [totalChainsLength]) }}
    </div>
    <NeoButton
      v-if="totalChainsLength"
      variant="pill"
      :label="$t('profile.searchNoResultsButton', [chainNames[nextPrefix]])"
      @click="switchToPrefix(nextPrefix)" />
  </section>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { type Prefix, chainNames } from '@kodadot1/static'

const props = defineProps({
  prefixListWithAsset: { type: Array<Prefix>, default: () => [] },
})

const { redirectAfterChainChange } = useChainRedirect()
const { setUrlPrefix } = usePrefix()
const totalChainsLength = computed(() => props.prefixListWithAsset.length)
const nextPrefix = computed(() => props.prefixListWithAsset[0])

const switchToPrefix = (targetPrefix: Prefix) => {
  setUrlPrefix(targetPrefix)
  redirectAfterChainChange(targetPrefix)
}
</script>
