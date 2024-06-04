<template>
  <div class="w-full max-w-[490px] flex flex-col gap-4">
    <CodeCheckerMassPreviewCanvas :assets="assets" />

    <CodeCheckerMassPreviewCapture
      :assets="assets"
      :index-content="indexContent" />
  </div>
</template>
<script lang="ts" setup>
import { AssetMessage } from '../types'

defineProps<{
  assets: Array<AssetMessage>
  indexContent: string
}>()
</script>
