<template>
  <BasicImage
    :class="[
      disabled ? 'selectable-image-disabled' : 'selectable-image',
      { 'is-selected': selected },
    ]"
    :src="src"
    alt="Some Image"
    @click="handleClick" />
</template>

<script setup lang="ts">
import BasicImage from '@/components/shared/view/BasicImage.vue'

const props = defineProps<{
  src: string
  index: number
  disabled: boolean
}>()

const selected = ref(false)
const emit = defineEmits(['click', 'remove'])

const handleClick = () => {
  selected.value = !selected.value
  emit(selected ? 'click' : 'remove', props.index)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/_variables';
.is-selected {
  border: 4px $link solid;
}
.selectable-image:hover {
  border: 4px $link-light solid;
  cursor: pointer;
}

.selectable-image-disabled:hover {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
