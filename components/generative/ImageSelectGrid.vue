<template>
  <div>
    <p class="title is-size-3">Select your 1 waifu</p>
    <p v-if="!predicion" class="title is-size-4">...Waifing for prediction</p>
    <template v-if="predicion && predicion.output">
      <p class="title is-size-4">
        🎉 loaded {{ predicion.output.length }} predictions
      </p>
      <p
        v-if="expectedOutput - predicion.output.length"
        class="title is-size-4">
        {{ expectedOutput - predicion.output.length }} prediction(s) was marked
        as NFSW 🔞
      </p>
    </template>
    <ImageGrid
      v-if="predicion && predicion.output"
      :images="predicion.output"
      :disabled="selected !== ''"
      @select="handleSelectImage" />
  </div>
</template>

<script setup lang="ts">
import { OUTPUTS, PredictionStatus } from '@/services/replicate'

const ImageGrid = defineAsyncComponent(
  () => import('@/components/shared/view/ImageGrid.vue')
)

const expectedOutput = Number(OUTPUTS)

const emit = defineEmits(['select'])

const handleSelectImage = (image: string) => {
  emit('select', image)
}

const props = defineProps<{
  predicion: PredictionStatus
  selected: string
}>()
</script>
