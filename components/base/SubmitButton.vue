<template>
  <NeoField>
    <NeoButton
      :size="size"
      :type="type"
      :icon="icon"
      :disabled="disabled"
      :loading="loading"
      :expanded="expanded"
      :variant="variant"
      icon-pack="far"
      outlined
      @click.native="$emit('click')">
      <slot>
        <span :style="labelStyles">
          {{ $t(label) }}
        </span>
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
  icon?: string
  label: string
  loading?: boolean
  type?: string
  size?: 'small' | 'medium' | 'large'
  variant?: NeoButtonVariant
  fontSize: `${number}${'px' | 'rem' | 'em'}` | 'inherit'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  type: 'is-primary',
  icon: '',
  size: 'medium',
  variant: 'k-accent',
  fontSize: 'inherit',
})

const labelStyles = {
  'font-size': props.fontSize,
}
</script>
