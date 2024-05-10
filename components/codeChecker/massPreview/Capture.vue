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
import { uploadFile } from '@/services/playground'

type CapturePreviewItem = { image?: string } & PreviewItem

const AssetElementMap = {
  style: { src: 'href', tag: 'link' },
  script: { src: 'src', tag: 'script' },
}

const props = defineProps<{
  assets: Array<AssetMessage>
  index: string
  previews: number
}>()

const previews = ref<CapturePreviewItem[]>([])
const content = ref()

const replaceAssetContent = async (doc: Document, asset: AssetMessage) => {
  const response = await $fetch<string>(asset.src)

  const { src: srcAttribute, tag } = AssetElementMap[asset.type]

  const element = doc.querySelector(
    `${tag}[${srcAttribute}="${asset.originalSrc}"]`,
  )

  if (!element) {
    return
  }

  if (asset.type === 'style') {
    const head = doc.querySelector('head')
    const style = document.createElement('style')
    style.innerHTML = response
    head?.appendChild(style)
    element.remove()
    return
  }

  element.innerHTML = response
  element.removeAttribute(srcAttribute)
}

const buildIndexFile = async (): Promise<Blob> => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(props.index, 'text/html')

  await Promise.all(
    props.assets.map((asset) => replaceAssetContent(doc, asset)),
  )

  return new Blob([doc.documentElement.outerHTML], {
    type: 'text/html',
  })
}

const initCapture = async () => {
  const file = await buildIndexFile()

  await uploadFile(file, 'index.html')

  // get content url

  initScreenshot()
}

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

  initCapture()
}

watch(() => props.assets, generateMassPreview, { immediate: true })
</script>
