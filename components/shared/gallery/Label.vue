<template>
  <component :is="tag" class="label text-xs/normal">{{ $t(value) }}</component>
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
  },
)
</script>
