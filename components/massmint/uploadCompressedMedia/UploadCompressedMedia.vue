<template>
  <div>
    <NeoCollapsible :disabled="disabled">
      <div class="is-flex">
        {{ $t('massmint.uploadPics') }}
        <NeoIcon
          v-if="showCheckmark"
          icon="circle-check"
          variant="success"
          class="ml-3" />
      </div>
      <template #content>
        <DragDrop
          accept=".zip"
          :loading="loading"
          @fileSelected="onFileSelected">
          <template #title>
            <span class="mb-4 has-text-left">{{
              $t('massmint.uploadzipTip')
            }}</span>
            <span class="has-text-left"
              ><b>{{ $t('massmint.supportedFormats') }}</b>
              {{ acceptedMediaFormatsString }}</span
            >
          </template>
        </DragDrop>
      </template>
    </NeoCollapsible>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapsible, NeoIcon } from '@kodadot1/brick'
import { notificationTypes, showNotification } from '@/utils/notification'
import DragDrop from '@/components/shared/DragDrop.vue'
import {
  useZipFileValidator,
  validFormats,
} from '@/composables/massmint/useZipValidator'

const { $consola } = useNuxtApp()

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const loading = ref(false)
const showCheckmark = ref(false)

const acceptedMediaFormatsString = validFormats
  .map((format) => format.toUpperCase())
  .join(', ')

const emit = defineEmits(['zipLoaded'])

const onFileSelected = (file) => {
  const zipMimeTypes = ['application/zip', 'application/x-zip-compressed']
  showCheckmark.value = false
  if (file && zipMimeTypes.includes(file.type)) {
    loading.value = true
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const zipFilePath = reader.result as string
      const {
        allValid,
        loading: loadingZip,
        validFiles,
        warnings,
      } = useZipFileValidator(zipFilePath)
      watch(loadingZip, (isLoading) => {
        loading.value = isLoading
        if (!isLoading) {
          if (warnings.value.length > 0) {
            const fileNames = warnings.value
              .map(({ name }) => name)
              .join(',   ')

            showNotification(
              `${fileNames}  ${warnings.value.length} files were not uploaded`,
              notificationTypes.warn,
            )
          }
          showCheckmark.value = true
          emit('zipLoaded', {
            validFiles: validFiles.value,
            areAllFilesValid: allValid.value,
          })
        }
      })
    }

    reader.onerror = () => {
      $consola.error('Error reading zip file.')
    }
  } else {
    $consola.error('Invalid file type.')
  }
}
</script>
