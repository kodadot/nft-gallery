<template>
  <NeoUpload
    v-model="vSelectedFile"
    accept="image/*"
    drag-drop
    expanded
    native
    @update:model-value="fileSelected">
    <template v-if="!vSelectedFile">
      <div class="flex items-center p-2">
        <div
          class="flex items-center justify-center bg-neutral-3 dark:bg-neutral-11 w-16 h-16">
          <NeoIcon icon="up-to-line" pack="fas" />
        </div>
        <span class="text-center truncate ml-5">Click To Select A File</span>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center p-2">
        <NuxtImg
          :src="selectedFilePreview"
          alt="Selected file"
          class="w-16 h-16 object-cover" />
        <span class="text-center truncate ml-5">{{ vSelectedFile.name }}</span>
        <NeoButton
          class="absolute right-3 top-3"
          variant="icon"
          no-shadow
          icon="xmark"
          @click="vSelectedFile = null" />
      </div>
    </template>
  </NeoUpload>
</template>
<script setup lang="ts">
import { NeoButton, NeoIcon, NeoUpload } from '@kodadot1/brick'

const NuxtImg = resolveComponent('NuxtImg')

const props = defineProps<{
  modelValue: File | null
}>()

const vSelectedFile = useVModel(props, 'modelValue')

const selectedFilePreview = computed(() =>
  vSelectedFile.value ? URL.createObjectURL(vSelectedFile.value as File) : '',
)

const fileSelected = (file: File | null) => {
  vSelectedFile.value = file
}
</script>
