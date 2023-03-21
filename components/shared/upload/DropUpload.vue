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
      <b-field class="file is-primary is-justify-content-center">
        <o-upload
          v-model="file"
          drag-drop
          :accept="accept"
          :expanded="expanded"
          @input="createInput">
          <section class="section">
            <div class="content has-text-centered">
              <div
                v-if="!file"
                class="main-label mb-6 is-flex is-flex-direction-column">
                <span class="mb-4 has-text-left">{{
                  $t('mint.collection.compressZip')
                }}</span>
                <span class="has-text-left"
                  ><b>{{ $t('mint.collection.formats') }}</b> {{ format }}</span
                >
              </div>
              <NeoIcon
                v-if="!file && !url"
                :icon="icon"
                class="cloud-icon"
                size="is-large"
                icon-pack="fas" />
              <div v-if="url && !isModelMedia" @click.prevent>
                <NeoIcon icon="circle-check" class="check-icon" />
              </div>
              <NeoIcon v-if="hasError" icon="eye-slash" size="is-large" />

              <p v-if="!file" class="description mt-6">
                {{ label }}
              </p>
              <div v-else class="is-flex is-align-items-center mt-6">
                <span class="description mr-5">
                  {{ file.name }} {{ $t('uploaded') }}
                </span>
                <div class="upload-file-label">
                  {{ $t('chooseFile') }}
                </div>
              </div>
            </div>
          </section>
        </o-upload>
      </b-field>
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
import { MAX_UPLOADED_FILE_SIZE } from '@/utils/constants'
import { OUpload } from '@oruga-ui/oruga'
import { NeoIcon } from '@kodadot1/brick'

const MediaResolver = defineAsyncComponent(
  () => import('@/components/media/MediaResolver.vue')
)

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    preview?: boolean
    expanded?: boolean
    accept?: string
    format?: string
  }>(),
  {
    label:
      'Drop your NFT here or click to upload or simply paste image from clipboard',
    icon: 'cloud-arrow-up',
    preview: false,
    expanded: false,
    accept: '',
    format:
      'BMP, GIF, JPEG, PNG, SVG, TIFF, WEBP, MP4, OGV, QUICKTIME, WEBM, GLB, FLAC, MP3, JSON',
  }
)

const file: any = ref(null)
const url = ref('')
let hasError = ref(false)
let checkFailed = ref(false)
let fileSizeFailed = ref(false)

const fileSizeLimit = MAX_UPLOADED_FILE_SIZE

const emit = defineEmits(['input'])

const mimeType = computed(() => {
  if (file?.value?.type) {
    return file?.value.type
  }

  const fileExtension = file?.value?.name.split('.').pop() || ''
  const extensionToMimeType = {
    glb: 'model/gltf-binary',
  }
  if (fileExtension in extensionToMimeType) {
    return extensionToMimeType[fileExtension]
  }
  return ''
})

const isModelMedia = computed(() => {
  return mimeType.value.startsWith('model')
})

const createInput = (file): void | boolean => {
  const fileSize = file.size / Math.pow(1024, 2)
  if (fileSize > fileSizeLimit) {
    fileSizeFailed.value = true
    file.value = null
    return false
  }
  fileSizeFailed.value = false
  checkFailed.value = false
  const reader = new FileReader()

  emit('input', file)
  if (props.preview) {
    url.value = URL.createObjectURL(file)
    hasError.value = false
  }

  reader.readAsText(file)
}
</script>
<style scoped lang="scss">
@import '@/styles/abstracts/variables';
.cloud-icon {
  font-size: 55px;
  @include ktheme() {
    color: theme('k-grey');
  }
}

.check-icon {
  font-size: 42px;
  @include ktheme() {
    color: theme('k-green');
  }
}

.description {
  @include ktheme() {
    color: theme('k-grey');
  }
}

.main-label {
  max-width: 390px;
}

.labels {
  text-align: left;
}

.button-upload {
  pointer-events: none;
}

.upload-file-label {
  padding: 7px 16px;
  @include ktheme() {
    background-color: theme('background-color');
    color: theme('black');
    border: 1px solid theme('border-color');
    &:hover {
      background-color: theme('k-primaryLight');
    }
  }
}
</style>
