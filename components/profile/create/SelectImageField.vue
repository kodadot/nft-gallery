<template>
  <NeoUpload
    v-model="vSelectedFile"
    accept="image/*"
    drag-drop
    expanded
    native
    @update:model-value="fileSelected"
  >
    <div class="flex items-center p-2">
      <div
        v-if="!vSelectedFile && !preview"
        class="flex items-center justify-center bg-neutral-3 dark:bg-neutral-11 w-16 h-16"
      >
        <KIcon
          name="i-mdi:upload"
        />
      </div>
      <NuxtImg
        v-else
        :src="selectedFilePreview || preview"
        alt="Selected file"
        class="w-16 h-16 object-cover"
      />
      <span class="text-center truncate ml-5">{{
        vSelectedFile?.name ?? 'Click To Select A File'
      }}</span>
      <NeoButton
        v-if="vSelectedFile || preview"
        class="absolute right-3 top-3"
        variant="icon"
        no-shadow
        icon="xmark"
        @click="clear"
      />
    </div>
  </NeoUpload>
</template>

<script setup lang="ts">
import { NeoButton, NeoUpload } from '@kodadot1/brick'

const NuxtImg = resolveComponent('NuxtImg')
const ONE_MB = 1024 * 1024

const emit = defineEmits(['clear'])
const props = defineProps<{
  modelValue: File | null
  preview?: string
  maxSizeInMb?: number
}>()

const vSelectedFile = useVModel(props, 'modelValue')
const { $i18n } = useNuxtApp()

const selectedFilePreview = computed(() =>
  vSelectedFile.value ? URL.createObjectURL(vSelectedFile.value as File) : '',
)

const clear = () => {
  vSelectedFile.value = null
  emit('clear')
}

const fileSelected = (file: File | null) => {
  if (file && props.maxSizeInMb && file.size > props.maxSizeInMb * ONE_MB) {
    vSelectedFile.value = null
    dangerMessage($i18n.t('toast.uploadFileSizeLimit', [props.maxSizeInMb]))
    return
  }
  vSelectedFile.value = file
}
</script>
