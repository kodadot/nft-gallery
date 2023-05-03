<template>
  <div>
    <div class="label">
      {{ $t('Minting Settings') }}
    </div>
    <div class="py-2">
      <Support v-model="hasSupport" :show-price="false" />
    </div>
    <div class="py-2">
      <Support
        v-model="hasCarbonOffset"
        :price="1"
        :active-message="$t('carbonOffset.carbonOffsetYes')"
        :passive-message="$t('carbonOffset.carbonOffsetNo')" />
    </div>
    <div class="py-2">
      <ArweaveUploadSwitch v-model="arweaveUpload" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ArweaveUploadSwitch from '@/components/rmrk/Create/ArweaveUploadSwitch.vue'
import Support from '@/components/shared/Support.vue'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()
const hasSupport = computed({
  get: () => preferencesStore.hasSupport,
  set: (value) => preferencesStore.setHasSupport(value),
})
const hasCarbonOffset = computed({
  get: () => preferencesStore.getHasCarbonOffset,
  set: (value) => preferencesStore.setHasCarbonOffset(value),
})
const arweaveUpload = computed({
  get: () => preferencesStore.arweaveUpload,
  set: (value) => preferencesStore.setArweaveUpload(value),
})
</script>
