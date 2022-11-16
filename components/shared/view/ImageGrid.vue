<template>
  <div class="columns is-multiline is-mobile">
    <div
      v-for="(src, index) in props.images"
      :key="index"
      class="column is-half">
      <SelectableImage
        :disabled="disabled"
        :index="index"
        :src="src"
        @click="handleClick(index)" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string[]
  disabled: boolean
}>()

const emit = defineEmits(['select'])
const SelectableImage = defineAsyncComponent(
  () => import('@/components/shared/view/SelectableImage.vue')
)

const handleClick = (index: number) => {
  emit('select', props.images[index])
}
</script>
