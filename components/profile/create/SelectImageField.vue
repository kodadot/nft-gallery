<template>
  <NeoUpload
    v-model="vSelectedFile"
    accept="image/*"
    drag-drop
    expanded
    native
    @update:model-value="fileSelected">
    <div class="flex items-center p-2">
      <div
        v-if="!vSelectedFile && !preview"
        class="flex items-center justify-center bg-neutral-3 dark:bg-neutral-11 w-16 h-16">
        <NeoIcon icon="up-to-line" pack="fas" />
      </div>
      <NuxtImg
        v-else
        :src="selectedFilePreview || preview"
        alt="Selected file"
        class="w-16 h-16 object-cover" />
      <span class="text-center truncate ml-5">{{
        vSelectedFile?.name ?? 'Click To Select A File'
      }}</span>
      <NeoButton
        v-if="vSelectedFile"
        class="absolute right-3 top-3"
        variant="icon"
        no-shadow
        icon="xmark"
        @click="vSelectedFile = null" />
    </div>
  </NeoUpload>
</template>
<script setup lang="ts">
import { NeoButton, NeoIcon, NeoUpload } from '@kodadot1/brick'

const NuxtImg = resolveComponent('NuxtImg')

const props = defineProps<{
  modelValue: File | null
  preview?: string
}>()

const vSelectedFile = useVModel(props, 'modelValue')

const selectedFilePreview = computed(() =>
  vSelectedFile.value ? URL.createObjectURL(vSelectedFile.value as File) : '',
)

const fileSelected = (file: File | null) => {
  vSelectedFile.value = file
}
</script>
