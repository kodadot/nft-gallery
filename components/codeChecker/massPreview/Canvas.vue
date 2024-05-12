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
        <div class="flex flex-col">
          <div class="flex justify-between items-center">
            <p>Number Of Previews</p>

            <div class="text-k-grey text-sm flex gap-3">
              <p class="capitalize">Time per variation</p>
              <p>{{ average }}s</p>
            </div>
          </div>

          <div class="flex gap-2 !mt-4">
            <NeoInput v-model="amount" class="!max-w-60" type="number" />
            <NeoButton
              no-shadow
              expanded
              class="!min-h-full"
              @click="generateMassPreview">
              <div class="inline-flex items-center gap-2">
                <span class="capitalize"> Retry test</span>
                <NeoIcon icon="rotate-left" />
              </div>
            </NeoButton>
          </div>
        </div>

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
import { AssetMessage } from '../types'
import { PreviewItem } from './types'
import { generateRandomHash } from '../utils'
import { NeoButton, NeoIcon, NeoInput, NeoSwitch } from '@kodadot1/brick'
import mean from 'lodash/mean'

type CanvasPreviewItem = {
  startedAt: number
  renderedAt?: number
} & PreviewItem

const props = defineProps<{
  assets: Array<AssetMessage>
  previews: number
}>()

const active = ref(false)
const amount = ref(props.previews)
const previews = ref<CanvasPreviewItem[]>([])

const average = computed(() =>
  (
    mean(
      previews.value
        .filter((preview) => preview.renderedAt)
        .map((preview) => preview.renderedAt! - preview.startedAt),
    ) / 1000
  ).toFixed(2),
)

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

watch(() => props.assets, generateMassPreview, { immediate: true })
</script>
