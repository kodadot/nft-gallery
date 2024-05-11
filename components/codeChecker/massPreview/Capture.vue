<template>
  <div>
    <div class="flex justify-between">
      <p class="font-bold capitalize">
        {{ $t('codeChecker.testOutCapture') }}
      </p>

      <span v-if="uploading" class="text-sm text-k-grey capitalize">
        {{ $t('codeChecker.uploadingFile') }}</span
      >
      <NeoSwitch v-else v-model="active" />
    </div>

    <transition name="slide">
      <CodeCheckerMassPreviewGrid v-if="active" :items="previews" class="mt-4">
        <template #default="{ item }: { item: CapturePreviewItem }">
          <BaseMediaItem v-if="item.image" :src="item.image" class="border" />
        </template>
      </CodeCheckerMassPreviewGrid>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { AssetMessage } from '../types'
import { PreviewItem } from './types'
import { generateRandomHash } from '../utils'
import { makeScreenshot } from '@/services/capture'
import { uploadFile } from '@/services/playground'
import { NeoSwitch } from '@kodadot1/brick'

type CapturePreviewItem = { image?: string } & PreviewItem

const AssetElementMap = {
  style: { src: 'href', tag: 'link' },
  script: { src: 'src', tag: 'script' },
}

const AssetReplaceElement: Record<
  'style' | 'script',
  (params: { content: string; doc: Document; element: Element }) => void
> = {
  style: ({ doc, content, element }) => {
    const head = doc.querySelector('head')
    const style = document.createElement('style')
    style.innerHTML = content
    head?.appendChild(style)
    element.remove()
  },
  script: ({ content, element }) => {
    element.innerHTML = content
    element.removeAttribute(AssetElementMap.style.src)
  },
}

const props = defineProps<{
  assets: Array<AssetMessage>
  index: string
  previews: number
}>()

const active = ref(false)
const uploading = ref(false)
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

  const assetReplace = AssetReplaceElement[asset.type] ?? null

  if (assetReplace) {
    assetReplace({ doc, content: response, element })
  }
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

const uploadIndex = async () => {
  try {
    uploading.value = true
    const file = await buildIndexFile()
    await uploadFile(file, 'index.html')
  } catch (error) {
  } finally {
    uploading.value = false
  }
}

const initCapture = async () => {
  initScreenshot()
}

const initScreenshot = () => {
  previews.value.forEach(async (preview) => {
    const url = new URL(content.value)

    url.searchParams.set('hash', preview.hash)

    try {
      const response = await makeScreenshot(url.toString())
      preview = {
        ...preview,
        image: URL.createObjectURL(response),
        loading: false,
      }
    } catch (error) {
      preview = { ...preview, loading: false }
    }

    previews.value = previews.value.map((p) =>
      p.hash === preview.hash ? preview : p,
    )
  })
}

const generateMassPreview = async () => {
  previews.value = Array.from({ length: props.previews }).map(() => ({
    hash: generateRandomHash(),
    loading: true,
  }))

  await initCapture()
}

watch([() => props.index], uploadIndex, { immediate: true })

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
