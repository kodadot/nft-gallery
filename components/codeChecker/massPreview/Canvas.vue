<template>
  <div>
    <div class="flex justify-between items-center">
      <p class="font-bold capitalize">
        {{ $t('codeChecker.testOutPerformance') }}
      </p>

      <NeoSwitch v-model="active" />
    </div>

    <transition name="slide">
      <div
        v-if="active"
        class="!mt-6"
      >
        <CodeCheckerMassPreviewControls
          v-model="amount"
          :previews="canvasPreviews"
          @retry="generateMassPreview"
        />

        <CodeCheckerMassPreviewGrid
          :items="canvasPreviews.map((p) => p.loading)"
          class="!mt-4"
        >
          <template #default="{ index }">
            <CodeCheckerSandboxIFrame
              :hash="canvasPreviews[index].hash"
              :assets="assets"
              :count="1"
              :iframe-id="canvasPreviews[index].hash"
              class="border"
            />
          </template>
        </CodeCheckerMassPreviewGrid>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { NeoSwitch } from '@kodadot1/brick'
import type { AssetMessage } from '../types'
import { generateRandomHash } from '../utils'
import type { CanvasPreviewItem } from './types'

const props = withDefaults(
  defineProps<{
    assets: Array<AssetMessage>
    previews?: number
  }>(),
  {
    previews: 12,
  },
)

const active = ref(false)
const amount = ref(props.previews)
const canvasPreviews = ref<CanvasPreviewItem[]>([])

const generateMassPreview = () => {
  canvasPreviews.value = Array.from({ length: amount.value }).map(() => ({
    hash: generateRandomHash(),
    startedAt: performance.now(),
    loading: true,
  }))
}

onKodahashRenderCompleted(({ payload: { hash } }) => {
  if (canvasPreviews.value.map(p => p.hash).includes(hash)) {
    canvasPreviews.value = canvasPreviews.value.map(preview =>
      preview.hash === hash
        ? { ...preview, renderedAt: performance.now(), loading: false }
        : preview,
    )
  }
})

watch(active, (active) => {
  if (active) {
    generateMassPreview()
  }
})
</script>
