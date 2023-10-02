<template>
  <div class="my-3">
    <div v-if="url && isModelMedia" class="p-2 mx-auto">
      <MediaResolver
        :src="url"
        :mime-type="mimeType"
        :preview="false"
        @error="hasError = true" />
    </div>
    <div class="field">
      <NeoField class="file is-primary" :addons="false">
        <NeoUpload
          ref="upload"
          v-model="file"
          :required="required"
          drag-drop
          :expanded="expanded"
          :accept="accept">
          <section class="section">
            <div class="content has-text-centered">
              <NeoIcon v-if="!file && !url" :icon="icon" custom-size="fa-2x" />
              <div v-if="url && !isModelMedia" @click.prevent>
                <MediaResolver
                  :src="url"
                  :mime-type="mimeType"
                  :preview="false"
                  @error="hasError = true" />
              </div>
              <NeoIcon v-if="hasError" icon="eye-slash" custom-size="fa-2x" />
              <p v-if="!file">
                {{ label }}
              </p>
              <p v-else class="mt-2">
                Awesome your file is <b>{{ file.name }}</b
                >. Click or drop to change
              </p>
            </div>
          </section>
        </NeoUpload>
      </NeoField>
      <transition v-if="fileSizeFailed" name="fade">
        <div class="help is-danger">
          {{ $t('tooltip.failedMaxSize') }}
        </div>
      </transition>
      <transition v-if="checkFailed" name="fade">
        <div class="help is-danger">
          {{ $t('tooltip.needToUploadNFTFile') }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MediaResolver from '@/components/media/MediaResolver.vue'
import { MAX_UPLOADED_FILE_SIZE } from '@/utils/constants'
import { NeoField, NeoIcon, NeoUpload } from '@kodadot1/brick'
import { useEventListener } from '@vueuse/core'

const props = defineProps({
  label: {
    type: String,
    default:
      'Drop your NFT here or click to upload or simply paste image from clipboard',
  },
  icon: { type: String, default: 'upload' },
  required: { type: Boolean, default: false },
  expanded: { type: Boolean },
  preview: { type: Boolean },
  accept: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['input'])

const file = ref<File | null>(null)
const fileSizeLimit = ref(MAX_UPLOADED_FILE_SIZE)
const url = ref('')
const hasError = ref(false)
const checkFailed = ref(false)
const fileSizeFailed = ref(false)
const upload = ref()

const mimeType = computed(() => {
  if (file.value?.type) {
    return file.value.type
  }
  //workaround for model media in chrome
  const fileExtension = file.value?.name.split('.').pop() || ''
  const extensionToMimeType = {
    glb: 'model/gltf-binary',
  }
  if (fileExtension in extensionToMimeType) {
    return extensionToMimeType[fileExtension]
  }
  return ''
})

const isModelMedia = computed(() => mimeType.value.startsWith('model'))

const checkValidity = () => {
  checkFailed.value = !file.value
  return !checkFailed.value
}

const onPasteImage = (pasteEvent: ClipboardEvent) => {
  /* handling paste logic */
  const item: DataTransferItem | any = pasteEvent?.clipboardData?.items[0]
  if (item?.type.indexOf('image') === 0) {
    const blob = item.getAsFile()
    file.value = blob
    createInput(blob)
  }
}

const createInput = (inputFile: Blob): void | boolean => {
  const fileSize = inputFile.size / Math.pow(1024, 2)
  if (fileSize > fileSizeLimit.value) {
    fileSizeFailed.value = true
    file.value = null
    return false
  }
  fileSizeFailed.value = false
  checkFailed.value = false
  const reader = new FileReader()
  emit('input', inputFile)
  if (props.preview) {
    url.value = URL.createObjectURL(inputFile)
    hasError.value = false
  }
  reader.readAsText(inputFile)
}

watch(file, () => {
  if (file.value) {
    createInput(file.value)
  }
})

useEventListener(window, 'paste', onPasteImage)

defineExpose({ checkValidity })
</script>
