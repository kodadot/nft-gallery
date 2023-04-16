<template>
  <div class="py-5">
    <div class="field">
      <b-field class="file is-primary is-justify-content-center">
        <o-upload
          v-model="selectedFile"
          drag-drop
          :accept="'.zip'"
          @input="onFileSelected">
          <div class="content has-text-centered">
            <div
              v-if="!selectedFile"
              class="main-label is-flex is-flex-direction-column">
              <span class="mb-4 has-text-left">{{
                $t('mint.collection.compressZip')
              }}</span>
              <span class="has-text-left"
                ><b>{{ $t('mint.collection.formats') }}</b>
                {{ acceptedMediaFormatsString }}</span
              >

              <NeoIcon
                icon="cloud-arrow-up"
                class="cloud-icon py-3"
                size="is-large"
                icon-pack="fas" />
              <p class="description mt-8">
                {{ $t('mint.collection.massmintDrop') }}
              </p>
            </div>
            <transition v-else-if="loading" name="fade">
              <img src="/preloader.svg" width="200" />
            </transition>
            <div v-else class="is-flex is-align-items-center">
              <div
                class="is-flex is-flex-direction-column is-justify-content-space-between">
                <NeoIcon icon="circle-check" class="check-icon" />
                <div class="is-flex is-align-items-center mt-6">
                  <span class="description mr-5">
                    {{ selectedFile?.name }} {{ $t('uploaded') }}
                  </span>
                  <div class="upload-file-label">
                    {{ $t('chooseFile') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </o-upload>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OUpload } from '@oruga-ui/oruga'
import { NeoIcon } from '@kodadot1/brick'
import { useZipFileValidator } from './useZipValidator'

const acceptedMediaFormatsString =
  'BMP, GIF, JPEG, PNG, SVG, TIFF, WEBP, MP4, OGV, QUICKTIME, WEBM, GLB, FLAC, MP3, JSON'

const selectedFile = ref<File | null>(null)

const loading = ref<boolean>(false)

const emit = defineEmits(['fileSelected'])

const onFileSelected = (file) => {
  emit('fileSelected', false)
  if (file && file.type === 'application/zip') {
    loading.value = true
    selectedFile.value = file
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const zipFilePath = reader.result as string
      const {
        allValid,
        loading: loadingZip,
        totalFiles,
        validFiles,
        warnings,
      } = await useZipFileValidator(zipFilePath)
      watch(loadingZip, (isLoading) => {
        loading.value = isLoading
        if (!isLoading) {
          emit('fileSelected', true, {
            validFiles: validFiles.value,
            warnings: warnings.value,
            totalFiles: totalFiles.value,
            areAllFilesValid: allValid.value,
          })
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

.upload-file-label {
  padding: 7px 16px;

  @include ktheme() {
    background-color: theme('background-color');
    color: theme('text-color');
    border: 1px solid theme('border-color');

    &:hover {
      background-color: theme('k-primaryLight');
    }
  }
}
</style>
