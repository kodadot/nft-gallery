<template>
  <component :is="tag" class="label">{{ $t(value) }}</component>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    value: string
    tag: string
  }>(),
  {
    value: '',
    tag: 'p',
  }
)
</script>
