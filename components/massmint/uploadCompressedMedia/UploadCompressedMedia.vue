<template>
  <div>
    <NeoCollapsible :disabled="disabled">
      <div class="flex">
        {{ $t('massmint.uploadPics') }}
        <NeoIcon
          v-if="showCheckmark"
          icon="circle-check"
          variant="success"
          class="ml-3"
        />
      </div>
      <template #content>
        <DragDrop
          accept=".zip"
          :loading="loading"
          @file-selected="onFileSelected"
        >
          <template #title>
            <span class="mb-4 text-left">{{
              $t('massmint.uploadzipTip')
            }}</span>
            <span class="text-left"><b>{{ $t('massmint.supportedFormats') }}</b>
              {{ acceptedMediaFormatsString }}</span>
          </template>
        </DragDrop>
      </template>
    </NeoCollapsible>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapsible, NeoIcon } from '@kodadot1/brick'
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
  .map(format => format.toUpperCase())
  .join(', ')

const emit = defineEmits(['zipLoaded'])

const onFileSelected = async (file) => {
  const zipMimeTypes = ['application/zip', 'application/x-zip-compressed']
  showCheckmark.value = false
  if (file && zipMimeTypes.includes(file.type)) {
    loading.value = true
    try {
      const stream = file.stream()
      const chunks: Uint8Array[] = []
      const reader = stream.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }

      const blob = new Blob(chunks)
      const zipFilePath = URL.createObjectURL(blob)

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

            warningMessage(
              `${fileNames}  ${warnings.value.length} files were not uploaded`,
            )
          }
          showCheckmark.value = true
          emit('zipLoaded', {
            validFiles: validFiles.value,
            areAllFilesValid: allValid.value,
          })

          URL.revokeObjectURL(zipFilePath)
        }
      })
    }
    catch (error) {
      $consola.error('Error processing zip file:', error)
      loading.value = false
    }
  }
  else {
    $consola.error('Invalid file type.')
  }
}
</script>
