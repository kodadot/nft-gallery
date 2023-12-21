<template>
  <div>
    <NeoCollapsible :disabled="disabled">
      <div class="flex">
        {{ $t('massmint.uploadDesc') }}
        <NeoIcon
          v-if="showCheckmark"
          icon="circle-check"
          variant="success"
          class="ml-3" />
      </div>
      <template #content>
        <DragDrop
          accept=".txt,.json,.csv"
          :loading="loading"
          @fileSelected="onFileSelected">
          <template #title>
            <span class="mb-4 has-text-left">{{
              $t('massmint.uploadDescriptionTip')
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
import DragDrop from '@/components/shared/DragDrop.vue'
import { useParseDescriptionFile } from '@/composables/massmint/useParseDescriptionFile'

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

const acceptedMediaFormatsString = '.TXT, .CSV, .JSON'

const emit = defineEmits(['fileLoaded'])

const onFileSelected = (file: File) => {
  showCheckmark.value = false
  loading.value = true

  const { entries, error, loading: isLoading } = useParseDescriptionFile(file)

  watch(isLoading, (loadingDescFile) => {
    loading.value = loadingDescFile
    showCheckmark.value = !loadingDescFile
    if (!loadingDescFile && !error.value) {
      emit('fileLoaded', entries.value)
    }
  })
}
</script>
