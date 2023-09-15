<template>
  <NeoAudioPlayer :src="animationSrc" />
</template>

<script lang="ts" setup>
import { NeoAudioPlayer } from '@kodadot1/brick'

defineProps<{
  animationSrc?: string
}>()
</script>
