<template>
  <NeoField>
    <NeoButton
      :class="customClass"
      :size="size"
      :type="type"
      :icon-left="icon"
      :disabled="disabled"
      :loading="loading"
      :expanded="expanded"
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

export interface Props {
  disabled?: boolean
  expanded?: boolean
  icon?: string
  label: string
  loading?: boolean
  type?: string
  size?: 'small' | 'medium' | 'large'
  customClass: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  type: 'is-primary',
  icon: 'paper-plane',
  size: 'medium',
})
</script>
