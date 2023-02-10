<template>
  <div>
    <p class="label">
      {{ $t(label) }}
    </p>
    <p class="subtitle is-size-6">
      <slot v-if="!isLoading">~</slot>
      <b-skeleton :active="isLoading"></b-skeleton>
    </p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    label: string
    type?: boolean
    isLoading?: boolean
  }>(),
  {
    label: 'general.label',
    type: false,
    isLoading: false,
  }
)
</script>
