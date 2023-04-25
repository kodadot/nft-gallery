<template>
  <div>
    <NeoCollapse :disabled="disabled">
      <div class="is-flex">
        {{ $t('massmint.uploadDesc') }}
        <NeoIcon
          v-if="showCheckmark"
          icon="circle-check"
          size="small"
          variant="success"
          class="ml-3" />
        <div v-else class="icon-placeholder ml-3" />
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
    </NeoCollapse>
  </div>
</template>

<script setup lang="ts">
import { NeoCollapse, NeoIcon } from '@kodadot1/brick'
import DragDrop from '@/components/shared/DragDrop.vue'
const { $consola } = useNuxtApp()
import { useParseDescriptionFile } from './useParseDescriptionFile'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const loading = ref(false)
const showCheckmark = ref(false)

const acceptedMediaFormatsString = '.TXT, .CSV, .JSON'

const emit = defineEmits(['fileLoaded'])

const onFileSelected = (file: File) => {
  showCheckmark.value = false
  loading.value = true

  // replace true with check for valid file type
  const { entries, error, loading: isLoading } = useParseDescriptionFile(file)

  watch(isLoading, (loadingDescFile) => {
    loading.value = loadingDescFile
    showCheckmark.value = !loadingDescFile
  })
}
</script>
<style lang="scss" scoped>
.icon-placeholder {
  width: 1rem;
}
</style>
