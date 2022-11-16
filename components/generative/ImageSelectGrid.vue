<template>
  <div>
    <p class="title is-size-3">Select your 1 waifu</p>
    <ImageGrid
      v-if="predicion && predicion.output"
      :images="predicion.output"
      :disabled="selected !== ''"
      @select="handleSelectImage" />
  </div>
</template>

<script setup lang="ts">
import { PredictionStatus } from '@/services/replicate'

const ImageGrid = defineAsyncComponent(
  () => import('@/components/shared/view/ImageGrid.vue')
)

const emit = defineEmits(['select'])

const handleSelectImage = (image: string) => {
  emit('select', image)
}

const props = defineProps<{
  predicion: PredictionStatus
  selected: string
}>()
</script>
