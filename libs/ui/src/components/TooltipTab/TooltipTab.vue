<template>
  <o-tab-item
    :value="value"
    class="py-5 tooltip-tab"
    :disabled="disabled"
    :label="label">
    <template #header>
      <b-tooltip
        v-if="disabled"
        append-to-body
        class="disabled-tab-tooltip"
        square
        position="is-top"
        :label="disabledTooltip"
        @click.native.stop>
        {{ label }}
      </b-tooltip>

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
@import './TooltipTab.scss';
</style>
