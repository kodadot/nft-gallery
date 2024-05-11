<template>
  <div class="w-full max-w-[490px]">
    <div class="flex justify-between items-center">
      <p class="font-bold capitalize">
        {{ $t('codeChecker.testOutPerformance') }}
      </p>

      <NeoSwitch v-model="performance" />
    </div>

    <transition name="slide">
      <CodeCheckerMassPreviewCanvas
        v-if="performance"
        :assets="assets"
        :previews="PREVIEWS_AMOUNT"
        class="!mt-6" />
    </transition>

    <CodeCheckerMassPreviewCapture
      class="mt-4"
      :assets="assets"
      :index="index"
      :previews="PREVIEWS_AMOUNT" />
  </div>
</template>
<script lang="ts" setup>
import { AssetMessage } from '../types'
import { NeoSwitch } from '@kodadot1/brick'

const performance = ref(false)

const PREVIEWS_AMOUNT = 12

defineProps<{
  assets: Array<AssetMessage>
  index: string
}>()
</script>
