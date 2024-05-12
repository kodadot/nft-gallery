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
import { uploadFile, uploadPresigned } from '@/services/playground'
import { NeoSwitch } from '@kodadot1/brick'
import { AssetElementMap, AssetReplaceElement } from './utils'

type CapturePreviewItem = { image?: string } & PreviewItem

const props = defineProps<{
  assets: Array<AssetMessage>
  index: string
  previews: number
}>()

const active = ref(false)
const uploading = ref(false)
const previews = ref<CapturePreviewItem[]>([])
const indexKey = ref()

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
    const { key } = await uploadFile(file, 'index.html')
    indexKey.value = key
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
    try {
      const { url } = await uploadPresigned(indexKey.value, {
        hash: preview.hash,
      })

      const response = await makeScreenshot(url)

      preview = {
        ...preview,
        image: URL.createObjectURL(response),
      }
    } catch (error) {
    } finally {
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

watch(
  [() => props.assets, () => props.index],
  ([assets, index]) => {
    if (assets.length && index) {
      uploadIndex()
    }
  },
  { immediate: true },
)

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
