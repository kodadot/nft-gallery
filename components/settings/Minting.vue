<template>
  <div>
    <div class="label text-xs/normal">
      {{ $t('Minting Settings') }}
    </div>
    <div class="py-2 flex">
      <Support v-model="hasSupport" :show-price="false" />
      <NeoTooltip :label="$t('support.tooltip')" position="bottom" multiline>
        <NeoIcon icon="info-circle" />
      </NeoTooltip>
    </div>
    <div class="py-2 flex">
      <Support
        v-model="hasCarbonOffset"
        :price="1"
        :active-message="$t('carbonOffset.carbonOffsetYes')"
        :passive-message="$t('carbonOffset.carbonOffsetNo')" />
      <NeoTooltip
        :label="$t('carbonOffset.tooltip')"
        position="bottom"
        multiline>
        <NeoIcon icon="info-circle" />
      </NeoTooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Support from '@/components/shared/Support.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'

const preferencesStore = usePreferencesStore()
const hasSupport = computed({
  get: () => preferencesStore.hasSupport,
  set: (value) => preferencesStore.setHasSupport(value),
})
const hasCarbonOffset = computed({
  get: () => preferencesStore.getHasCarbonOffset,
  set: (value) => preferencesStore.setHasCarbonOffset(value),
})
</script>
