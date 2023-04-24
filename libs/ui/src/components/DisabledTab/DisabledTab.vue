<template>
  <o-tab-item :value="value" class="py-5" :label="label" :disabled="disabled">
    <template #header>
      <NeoTooltip v-if="disabled" :label="disabledTooltip">
        {{ label }}
      </NeoTooltip>

      <div v-else>
        {{ label }}
      </div>
    </template>
    <slot>
      <div />
    </slot>
  </o-tab-item>
</template>

<script setup lang="ts">
import { OTabItem } from '@oruga-ui/oruga'
import NeoTooltip from '../NeoTooltip/NeoTooltip.vue'
import { LocaleMessage } from 'vue-i18n'
export interface Props {
  disabled?: boolean
  label: string | LocaleMessage
  value: string
  disabledTooltip?: string | LocaleMessage
}
withDefaults(defineProps<Props>(), {
  disabled: false,
  disabledTooltip: '',
})
</script>

<style lang="scss">
@import './DisabledTab.scss';
</style>
