<template>
  <div class="is-flex is-align-items-center is-justify-content-space-between">
    <div>
      <NeoButton
        v-if="isBasilisk"
        v-safe-href="`/${urlPrefix}/assets`"
        no-shadow
        rounded
        tag="a"
        size="small"
        icon="arrow-right-long">
        Portfolio View
      </NeoButton>
    </div>

    <a class="has-text-grey is-size-7" @click="rampActive = true"
      >+ {{ $t('addFunds') }}</a
    >

    <OnRampModal v-model="rampActive" @close="rampActive = false" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import OnRampModal from '@/components/shared/OnRampModal.vue'

const { urlPrefix } = usePrefix()
const { isBasilisk } = useIsChain(urlPrefix)
const rampActive = ref(false)
</script>

<style scoped></style>
