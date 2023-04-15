<template>
  <div>
    <div class="my-3">
      <div class="field">
        <b-field class="file is-primary is-justify-content-center">
          <o-upload
            v-model="file"
            drag-drop
            :accept="accept"
            :expanded="expanded"
            @input="onFileSelected">
            <section class="section">
              <div class="content has-text-centered">
                <div
                  v-if="!file"
                  class="main-label mb-8 is-flex is-flex-direction-column">
                  <span class="mb-4 has-text-left">{{
                    $t('mint.collection.compressZip')
                  }}</span>
                  <span class="has-text-left"
                    ><b>{{ $t('mint.collection.formats') }}</b>
                    {{ format }}</span
                  >
                </div>
                <NeoIcon
                  v-if="!file"
                  :icon="icon"
                  class="cloud-icon"
                  size="is-large"
                  icon-pack="fas" />
                <!-- <div v-if="url && !isModelMedia" @click.prevent>
                  <NeoIcon icon="circle-check" class="check-icon" />
                </div>
                <NeoIcon v-if="hasError" icon="eye-slash" size="is-large" /> -->
                <p v-if="!file" class="description mt-8">
                  {{ label }}
                </p>
                <div v-else class="is-flex is-align-items-center mt-8">
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
        <!-- <transition v-if="fileSizeFailed" name="fade">
          <div class="help is-danger">
            {{ $t('tooltip.failedMaxSize') }}
          </div>
        </transition>
        <transition v-if="checkFailed" name="fade">
          <div class="help is-danger">
            {{ $t('tooltip.needToUploadNFTFile') }}
          </div>
        </transition> -->
      </div>
    </div>
    <div>
      {{ loading }}
    </div>
    <div v-if="!loading">
      <div v-for="file in validFiles" :key="file.name">
        <img :src="file.url" class="preview-image" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OUpload } from '@oruga-ui/oruga'
import { NeoIcon } from '@kodadot1/brick'
import {
  FileObject,
  WarningObject,
  useZipFileValidator,
} from './useZipValidator'

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
    accept: '.zip',
    format:
      'BMP, GIF, JPEG, PNG, SVG, TIFF, WEBP, MP4, OGV, QUICKTIME, WEBM, GLB, FLAC, MP3, JSON',
  }
)

const file = ref<File | null>(null)

const validFiles = ref<FileObject[]>([])
const warnings = ref<WarningObject[]>([])
const loading = ref<boolean>(true)
const totalFiles = ref<number>(0)
const allValid = ref<boolean>(false)

const emit = defineEmits(['input'])

const onFileSelected = (file) => {
  if (file && file.type === 'application/zip') {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const zipFilePath = reader.result as string
      const {
        validFiles: vf,
        warnings: w,
        loading: l,
        totalFiles: tf,
        allValid: av,
      } = await useZipFileValidator(zipFilePath)
      watch(l, () => {
        if (l.value === false) {
          validFiles.value = vf.value
          warnings.value = w.value
          loading.value = l.value
          totalFiles.value = tf.value
          allValid.value = av.value
        }
      })
    }

    reader.onerror = () => {
      console.error('Error reading zip file.')
    }
  } else {
    console.error('Invalid file type.')
  }
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
