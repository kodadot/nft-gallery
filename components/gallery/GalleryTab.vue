<template>
  <o-tab-item :value="value" class="py-5" :disabled="disabled">
    <template #header>
      <b-tooltip
        v-if="disabled"
        append-to-body
        class="disabled-tab-tooltip"
        square
        position="is-top"
        :label="disabledTooltip"
        @click.native.stop>
        <span>{{ label }}</span>
      </b-tooltip>
      <span v-else>
        {{ label }}
      </span>
    </template>
    <slot></slot>
  </o-tab-item>
</template>

<script setup lang="ts">
import { OTabItem } from '@oruga-ui/oruga'
import { LocaleMessage } from 'vue-i18n'

export interface Props {
  disabled?: boolean
  label: string | LocaleMessage
  value: string
  disabledTooltip?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  disabledTooltip: '',
})
</script>
