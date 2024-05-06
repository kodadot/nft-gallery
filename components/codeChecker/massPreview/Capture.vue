<template>
  <div>
    <CodeCheckerMassPreviewGrid :items="previews" class="mt-4">
      <template #default="{ item }: { item: CapturePreviewItem }">
        <BaseMediaItem v-if="item.image" :src="item.image" class="border" />
      </template>
    </CodeCheckerMassPreviewGrid>
  </div>
</template>
<script lang="ts" setup>
import { AssetMessage } from '../types'
import { PreviewItem } from './types'
import { generateRandomHash } from '../utils'
import { makeScreenshot } from '@/services/capture'

type CapturePreviewItem = { image?: string } & PreviewItem

const previews = ref<CapturePreviewItem[]>([])

const content = ref()

const props = defineProps<{
  assets: Array<AssetMessage>
  previews: number
}>()

const initScreenshot = () => {
  previews.value.forEach(async (preview) => {
    const url = new URL(content.value)

    url.searchParams.set('hash', preview.hash)

    const response = await makeScreenshot(url.toString())

    previews.value = previews.value.map((p) =>
      p.hash === preview.hash
        ? { ...preview, image: URL.createObjectURL(response) }
        : p,
    )
  })
}

const generateMassPreview = async () => {
  previews.value = Array.from({ length: props.previews }).map(() => ({
    hash: generateRandomHash(),
    loading: true,
  }))

  initScreenshot()
}

watch(() => props.assets, generateMassPreview, { immediate: true })
</script>
