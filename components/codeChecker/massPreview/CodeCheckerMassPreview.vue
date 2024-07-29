<template>
  <div class="w-full max-w-[490px] flex flex-col gap-4">
    <CodeCheckerMassPreviewCanvas :assets="assets" />

    <CodeCheckerMassPreviewCapture
      :assets="assets"
      :index-content="indexContent"
      @upload="(v) => $emit('upload', v)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { AssetMessage } from '../types'

defineEmits(['upload'])
defineProps<{
  assets: Array<AssetMessage>
  indexContent: string
}>()
</script>
