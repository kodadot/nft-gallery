<template>
  <div class="w-full max-w-[490px]">
    <CodeCheckerMassPreviewCanvas
      :assets="assets"
      :previews="PREVIEWS_AMOUNT" />

    <CodeCheckerMassPreviewCapture
      class="mt-4"
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
