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

    <div class="flex justify-between mt-4">
      <p class="font-bold capitalize">
        {{ $t('codeChecker.testOutCapture') }}
      </p>

      <NeoSwitch v-model="capture" />
    </div>

    <transition name="slide">
      <CodeCheckerMassPreviewCapture
        v-if="capture"
        :assets="assets"
        :index="index"
        :previews="PREVIEWS_AMOUNT" />
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { AssetMessage } from '../types'
import { NeoSwitch } from '@kodadot1/brick'

const performance = ref(false)
const capture = ref(false)

const PREVIEWS_AMOUNT = 12

defineProps<{
  assets: Array<AssetMessage>
  index: string
}>()
</script>
