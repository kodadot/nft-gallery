<template>
  <b-field>
    <b-button
      :type="type"
      :icon-left="icon"
      :disabled="disabled"
      :loading="loading"
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
  label: string
  loading?: boolean
  disabled?: boolean
  icon?: string
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  type: 'is-primary',
  icon: 'paper-plane',
})
</script>
