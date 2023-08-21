<template>
  <NeoField>
    <NeoButton
      :size="size"
      :type="type"
      :icon="disabledIcon ? '' : icon"
      :disabled="disabled"
      :loading="loading"
      :expanded="expanded"
      :variant="variant"
      icon-pack="far"
      outlined
      @click.native="$emit('click')">
      <slot>
        {{ $t(label) }}
      </slot>
    </NeoButton>
  </NeoField>
</template>

<script setup lang="ts">
import { NeoButton, NeoField } from '@kodadot1/brick'
import { NeoButtonVariant } from '@kodadot1/brick'

export interface Props {
  disabled?: boolean
  expanded?: boolean
  disabledIcon?: boolean
  icon?: string
  label: string
  loading?: boolean
  type?: string
  size?: 'small' | 'medium' | 'large'
  variant?: NeoButtonVariant
}

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  disabledIcon: false,
  type: 'is-primary',
  icon: 'paper-plane',
  size: 'medium',
  variant: 'k-accent',
})
</script>
