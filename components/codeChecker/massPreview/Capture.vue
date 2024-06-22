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
          :previews="previewItems"
          hide-average
          @retry="generateMassPreview" />

        <CodeCheckerMassPreviewGrid :items="previewItems.map((p) => p.loading)">
          <template #default="{ index }">
            <iframe
              title="preview"
              :src="previewItems[index].image"
              class="w-full h-full border border-black border-solid"></iframe>
          </template>
        </CodeCheckerMassPreviewGrid>
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup>
import { NeoSwitch } from '@kodadot1/brick'
import { getObjectUrl, getUpload, uploadFile } from '@/services/playground'
import { AssetMessage } from '../types'
import { CapturePreviewItem } from './types'
import { generateRandomHash } from '../utils'
import { AssetElementMap, AssetReplaceElement } from './utils'
import { getDocumentFromString } from '../utils'

const emit = defineEmits(['upload'])
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

const previewItems = ref<CapturePreviewItem[]>([])
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
  const doc = getDocumentFromString(props.indexContent)

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
    await exponentialBackoff(() => getUpload(key)).catch(console.log)
    indexKey.value = key
    emit('upload', getObjectUrl(key))
  } catch (error) {
    dangerMessage(`${$i18n.t('codeChecker.failedUploadingIndex')}: ${error}`)
  } finally {
    uploading.value = false
  }
}

const updatePreview = (preview: CapturePreviewItem) => {
  previewItems.value = previewItems.value.map((p) =>
    p.hash === preview.hash ? preview : p,
  )
}

const initScreenshot = () => {
  if (!indexKey.value) {
    return
  }

  previewItems.value.forEach(async (preview) => {
    try {
      let url = getObjectUrl(indexKey.value!)
      url += `?hash=${preview.hash}`

      const response = `https://iframe-to-blob.pages.dev/iframe?url=${url}`

      preview = {
        ...preview,
        image: response,
      }
    } catch (error) {
    } finally {
      preview = { ...preview, loading: false }
    }

    updatePreview(preview)
  })
}

const generateMassPreview = async () => {
  previewItems.value = Array.from({ length: previewAmount.value }).map(() => ({
    hash: generateRandomHash(),
    loading: true,
  }))

  initScreenshot()
}

watch(
  [() => props.assets, () => props.indexContent],
  ([assets, indexContent]) => {
    if (assets.length && indexContent) {
      uploadIndex()
    }
  },
  { immediate: true },
)

watch(active, (active) => {
  if (active) {
    generateMassPreview()
  }
})
</script>
