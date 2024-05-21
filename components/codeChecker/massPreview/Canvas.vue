<template>
  <div>
    <div class="flex justify-between items-center">
      <p class="font-bold capitalize">
        {{ $t('codeChecker.testOutPerformance') }}
      </p>

      <NeoSwitch v-model="active" />
    </div>

    <transition name="slide">
      <div v-if="active" class="!mt-6">
        <CodeCheckerMassPreviewControls
          v-model="amount"
          :previews="previews"
          @retry="generateMassPreview" />

        <CodeCheckerMassPreviewGrid :items="previews" class="!mt-4">
          <template #default="{ item }: { item: CanvasPreviewItem }">
            <CodeCheckerSandboxIFrame
              :hash="item.hash"
              :assets="assets"
              :count="1"
              :iframe-id="item.hash"
              class="border" />
          </template>
        </CodeCheckerMassPreviewGrid>
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { NeoSwitch } from '@kodadot1/brick'
import { AssetMessage } from '../types'
import { CanvasPreviewItem } from './types'
import { generateRandomHash } from '../utils'

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
const previews = ref<CanvasPreviewItem[]>([])

const generateMassPreview = () => {
  previews.value = Array.from({ length: amount.value }).map(() => ({
    hash: generateRandomHash(),
    startedAt: performance.now(),
    loading: true,
  }))
}

useEventListener(window, 'message', async (res) => {
  const hash = res.data.payload.hash
  if (
    res.data?.type === 'kodahash/render/completed' &&
    previews.value.map((p) => p.hash).includes(hash)
  ) {
    previews.value = previews.value.map((preview) =>
      preview.hash === hash
        ? { ...preview, renderedAt: performance.now(), loading: false }
        : preview,
    )
  }
})

watch(
  [active, () => props.assets],
  ([active]) => {
    if (active) {
      generateMassPreview()
    }
  },
  { immediate: true },
)
</script>
