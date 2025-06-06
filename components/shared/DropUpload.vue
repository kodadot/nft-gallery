<template>
  <div class="my-3">
    <div
      v-if="url && isModelMedia"
      class="p-2 mx-auto"
    >
      <BaseMediaItem
        :src="url"
        :mime-type="mimeType"
        :preview="false"
        @error="hasError = true"
      />
    </div>
    <div class="field">
      <NeoField
        class="file is-primary"
        :addons="false"
      >
        <NeoUpload
          ref="upload"
          v-model="file"
          :required="required"
          drag-drop
          :expanded="expanded"
          :accept="accept"
        >
          <section class="px-6 py-12">
            <div class="content text-center">
              <KIcon
                v-if="!file && !url"
                :name="icon"
                size="2x"
              />
              <div
                v-if="url && !isModelMedia"
                @click.prevent
              >
                <BaseMediaItem
                  :src="url"
                  :mime-type="mimeType"
                  :preview="false"
                  @error="hasError = true"
                />
              </div>
              <KIcon
                v-if="hasError"
                name="i-mdi:eye-off-outline"
                size="2x"
              />
              <p v-if="!file">
                {{ label }}
              </p>
              <p
                v-else
                class="mt-2"
              >
                Awesome your file is <b>{{ file.name }}</b>. Click or drop to change
              </p>
            </div>
          </section>
        </NeoUpload>
      </NeoField>
      <transition name="fade">
        <div
          v-if="fileSizeFailed"
          class="help is-danger"
        >
          {{ $t('tooltip.failedMaxSize') }}
        </div>
      </transition>
      <transition name="fade">
        <div
          v-if="checkFailed"
          class="help is-danger"
        >
          {{ $t('tooltip.needToUploadNFTFile') }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoField, NeoUpload } from '@kodadot1/brick'
import { useEventListener } from '@vueuse/core'
import { MAX_UPLOADED_FILE_SIZE } from '@/utils/constants'

const props = defineProps({
  label: {
    type: String,
    default:
      'Drop your NFT here or click to upload or simply paste image from clipboard',
  },
  icon: { type: String, default: 'i-mdi:folder-upload-outline' },
  required: { type: Boolean, default: false },
  expanded: { type: Boolean },
  preview: { type: Boolean },
  accept: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

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
  // workaround for model media in chrome
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

const createInput = (inputFile: Blob): undefined | boolean => {
  const fileSize = inputFile.size / Math.pow(1024, 2)
  if (fileSize > fileSizeLimit.value) {
    fileSizeFailed.value = true
    file.value = null
    return false
  }
  fileSizeFailed.value = false
  checkFailed.value = false
  const reader = new FileReader()
  emit('update:modelValue', inputFile)
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
