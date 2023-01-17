<template>
  <vue-qrcode
    :value="text"
    :options="{
      width: size,
      color: {
        dark: color,
        light: bgColor,
      },
    }" />
</template>

<script setup lang="ts">
import VueQrcode from '@chenfengyuan/vue-qrcode'

withDefaults(
  defineProps<{
    text: string
    size?: number
    color?: string
    bgColor?: string
  }>(),
  {
    size: 256,
    color: '#000',
    bgColor: '#FFF',
  }
)
</script>
