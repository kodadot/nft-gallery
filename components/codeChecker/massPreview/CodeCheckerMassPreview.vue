<template>
  <div class="w-full max-w-[490px] flex flex-col gap-4">
    <CodeCheckerMassPreviewCanvas
      :assets="assets"
      :previews="PREVIEWS_AMOUNT" />

    <CodeCheckerMassPreviewCapture
      :assets="assets"
      :index="index"
      :previews="PREVIEWS_AMOUNT" />
  </div>
</template>
<script lang="ts" setup>
import { AssetMessage } from '../types'

const PREVIEWS_AMOUNT = 12

defineProps<{
  assets: Array<AssetMessage>
  index: string
}>()
</script>
