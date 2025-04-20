<template>
  <Icon
    :name="name"
    :class="sizeMap[size]"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: 'default' | 'small' | 'medium' | 'large' | '2x' | '3x'
  }>(),
  {
    size: 'default',
  },
)

const sizeMap = {
  'default': 'size-5',
  'small': 'size-4',
  'medium': 'size-6',
  'large': 'size-8',
  '2x': 'size-10', // fa-2x
  '3x': 'size-14', // fa-3x
}
</script>
