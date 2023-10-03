<template>
  <div class="content is-hidden-mobile">
    <NeoField>
      <NeoTooltip :label="$t('tooltip.largeDisplay')">
        <NeoRadioButton
          v-model="preferenceLayout"
          type="is-primary"
          class="collection-radio-btn"
          native-value="is-half-desktop is-half-tablet"
          :disabled="disabled"
          data-testid="large-display">
          <span>
            <NeoIcon icon="th-large" />
          </span>
        </NeoRadioButton>
      </NeoTooltip>
      <NeoTooltip :label="$t('tooltip.smallDisplay')">
        <NeoRadioButton
          v-model="preferenceLayout"
          type="is-primary"
          class="collection-radio-btn"
          native-value="is-one-quarter-desktop is-one-third-tablet"
          :disabled="disabled"
          data-testid="small-display">
          <span>
            <NeoIcon icon="th" />
          </span>
        </NeoRadioButton>
      </NeoTooltip>
    </NeoField>
  </div>
</template>

<script lang="ts" setup>
import { usePreferencesStore } from '@/stores/preferences'
import { NeoField, NeoIcon, NeoRadioButton, NeoTooltip } from '@kodadot1/brick'

defineProps({
  type: { type: String, default: 'nftDetail' },
  link: { type: String, default: 'rmrk/detail' },
  disabled: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
})
const emit = defineEmits(['change'])
const preferencesStore = usePreferencesStore()
const preferenceLayout = computed({
  get: () => preferencesStore.getLayoutClass,
  set: (value) => {
    emit('change')
    preferencesStore.setLayoutClass(value)
  },
})
</script>
