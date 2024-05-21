<template>
  <div>
    <div class="flex justify-between items-center">
      <p class="font-bold capitalize">
        {{ $t('codeChecker.testOutCapture') }}
      </p>

      <span v-if="uploading" class="text-sm text-k-grey capitalize">
        {{ $t('codeChecker.uploadingFile') }}</span
      >
      <NeoSwitch v-else-if="indexKey" v-model="active" />
    </div>

    <transition name="slide">
      <div v-if="active" class="flex flex-col gap-4 !mt-6">
        <CodeCheckerMassPreviewControls
          v-model="previewAmount"
          :previews="previews"
          @retry="generateMassPreview" />

        <CodeCheckerMassPreviewGrid :items="previews.map((p) => p.loading)">
          <template #default="{ index }">
            <BaseMediaItem
              v-if="previews[index].image"
              :key="previews[index].hash"
              :src="previews[index].image"
              class="border" />
          </template>
        </CodeCheckerMassPreviewGrid>
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { NeoSwitch } from '@kodadot1/brick'
import { makeScreenshot } from '@/services/capture'
import { getObjectUrl, uploadFile } from '@/services/playground'
import { AssetMessage } from '../types'
import { CapturePreviewItem } from './types'
import { generateRandomHash } from '../utils'
import { AssetElementMap, AssetReplaceElement } from './utils'

const props = withDefaults(
  defineProps<{
    assets: Array<AssetMessage>
    indexContent: string
    previews?: number
  }>(),
  {
    previews: 12,
  },
)

const { $i18n } = useNuxtApp()

const previews = ref<CapturePreviewItem[]>([])
const previewAmount = ref(props.previews)
const active = ref(false)
const uploading = ref(false)
const indexKey = ref<string>()

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

  assetReplace?.({ doc, content: response, element })
}

const buildIndexFile = async (): Promise<Blob> => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(props.indexContent, 'text/html')

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
    const { key } = await uploadFile({
      file,
      fileName: 'index.html',
      prefix: 'codeChecker',
    })
    indexKey.value = key
  } catch (error) {
    dangerMessage(`${$i18n.t('codeChecker.failedUploadingIndex')}: ${error}`)
  } finally {
    uploading.value = false
  }
}

const initCapture = async () => {
  initScreenshot()
}

const updatePreview = (preview: CapturePreviewItem) => {
  previews.value = previews.value.map((p) =>
    p.hash === preview.hash ? preview : p,
  )
}

const initScreenshot = () => {
  if (!indexKey.value) {
    return
  }

  previews.value.forEach(async (preview) => {
    try {
      let url = getObjectUrl(indexKey.value!)

      url += `?hash=${preview.hash}`

      preview = { ...preview, startedAt: performance.now() }

      const response = await makeScreenshot(url)

      preview = {
        ...preview,
        image: URL.createObjectURL(response),
        renderedAt: performance.now(),
      }
    } catch (error) {
    } finally {
      preview = { ...preview, loading: false }
    }

    updatePreview(preview)
  })
}

const generateMassPreview = async () => {
  previews.value = Array.from({ length: previewAmount.value }).map(() => ({
    hash: generateRandomHash(),
    loading: true,
  }))

  await initCapture()
}

watch(
  [() => props.assets, () => props.indexContent],
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
