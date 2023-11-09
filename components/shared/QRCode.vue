<template>
  <qrcode-vue
    :value="text"
    :size="size"
    :level="level"
    :background="bgColor"
    :foreground="color" />
</template>

<script setup lang="ts">
import type { Level } from 'qrcode.vue'
import QrcodeVue from 'qrcode.vue'

withDefaults(
  defineProps<{
    text: string
    size?: number
    color?: string
    bgColor?: string
    level?: Level
  }>(),
  {
    size: 256,
    color: '#000',
    bgColor: '#FFF',
    level: 'M',
  },
)
</script>
