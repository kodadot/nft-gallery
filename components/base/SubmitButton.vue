<template>
  <b-field>
    <b-button
      :type="type"
      :icon-left="icon"
      :disabled="disabled"
      :loading="loading"
      :expanded="expanded"
      outlined
      @click="$emit('click')">
      <slot>
        {{ $t(label) }}
      </slot>
    </b-button>
  </b-field>
</template>

<script setup lang="ts">
export interface Props {
  disabled?: boolean
  expanded?: boolean
  icon?: string
  label: string
  loading?: boolean
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  type: 'is-primary',
  icon: 'paper-plane',
})
</script>
